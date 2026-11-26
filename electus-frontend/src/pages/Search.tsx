import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CandidateRow } from "@/components/dashboard/CandidateRow";
import { CandidateDetailModal } from "@/components/dashboard/CandidateDetailModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Candidate } from "@/types/candidate";

async function candidateRequest(path: string, options: RequestInit = {}) {
  const response = await fetch(`http://localhost:3000/candidates${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${localStorage.getItem("electus-token")}`,
    },
  });
  if (response.status === 401) {
    localStorage.removeItem("electus-token");
    window.location.assign("/login");
  }
  if (!response.ok) throw new Error("Candidate request failed");
  return response;
}

export default function Search() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const client = useQueryClient();
  const queryKey = ["candidate-search", query];
  const results = useQuery<Candidate[]>({
    queryKey,
    enabled: Boolean(query),
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: async ({ signal }) => {
      const response = await candidateRequest(`/search?q=${encodeURIComponent(query)}`, { signal });
      return response.json();
    },
  });

  const toggleStatus = async (id: string) => {
    const candidate = results.data?.find(row => row.id === id);
    if (!candidate) return;
    const reviewStatus = candidate.reviewStatus === "pending" ? "reviewed" : "pending";
    try {
      await candidateRequest(`/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewStatus }),
      });
      client.setQueryData<Candidate[]>(queryKey, rows =>
        rows?.map(row => row.id === id ? { ...row, reviewStatus } : row)
      );
      await client.invalidateQueries({ queryKey: ["candidate-search"], refetchType: "none" });
    } catch {
      toast.error("Could not update review status.");
    }
  };

  return (
    <DashboardLayout>
      <div className="candidate-search-page mx-auto max-w-3xl py-10 sm:py-20">
        <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-5xl">
          ready to find suitable candidates?
        </h1>
        <form className="mt-8 flex gap-2" role="search" onSubmit={event => {
          event.preventDefault();
          const submitted = input.trim();
          if (!submitted) return;
          if (submitted === query) void results.refetch();
          else setQuery(submitted);
        }}>
          <Input
            className="h-12 min-w-0 border-input bg-background text-base"
            aria-label="Describe the candidate you need"
            placeholder="e.g. Backend engineer with PostgreSQL and NestJS"
            value={input}
            onChange={event => setInput(event.target.value)}
            required
          />
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0" aria-label="Search candidates" disabled={!input.trim() || (results.isFetching && input.trim() === query)}>
            <SearchIcon aria-hidden="true" />
          </Button>
        </form>

        {query && (
          <section className="mt-12" aria-label="Search results" aria-busy={results.isFetching}>
            {results.isFetching ? (
              <p role="status" className="text-sm text-muted-foreground">Searching candidates…</p>
            ) : results.isError ? (
              <p role="alert" className="text-sm text-destructive">Could not complete the search. Submit again to retry.</p>
            ) : (
              <>
                <h2 className="mb-4 text-lg font-semibold" aria-live="polite">
                  {results.data?.length ?? 0} candidates found
                </h2>
                {results.data?.length ? (
                  <ul className="space-y-2">
                    {results.data.map(candidate => (
                      <li key={candidate.id} className="[&_.candidate-row]:flex-wrap [&_.candidate-row]:px-3 sm:[&_.candidate-row]:px-5">
                        <CandidateRow candidate={candidate} blindMode showMatchScore onViewProfile={setSelected} onToggleStatus={toggleStatus} />
                      </li>
                    ))}
                  </ul>
                ) : <p className="text-sm text-muted-foreground">Try a different role or skill.</p>}
              </>
            )}
          </section>
        )}
      </div>
      <CandidateDetailModal candidate={selected} open={Boolean(selected)} onClose={() => setSelected(null)} blindMode onMarkDone={toggleStatus} />
    </DashboardLayout>
  );
}
