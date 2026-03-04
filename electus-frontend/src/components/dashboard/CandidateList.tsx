import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateRow } from "./CandidateRow";
import type { Candidate } from "@/types/candidate";

interface CandidateListProps {
  candidates: Candidate[];
  blindMode: boolean;
  searchActive: boolean;
  onViewProfile: (candidate: Candidate) => void;
  onToggleStatus: (id: string) => void;
}

export function CandidateList({
  candidates,
  blindMode,
  searchActive,
  onViewProfile,
  onToggleStatus,
}: CandidateListProps) {
  const pending = candidates.filter((c) => c.status === "pending");
  const reviewed = candidates.filter((c) => c.status === "reviewed");

  return (
    <Tabs defaultValue="pending" className="animate-fade-in">
      <TabsList className="bg-white/[0.04] border border-white/[0.08] h-9">
        <TabsTrigger value="pending" className="text-xs text-white/50 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white data-[state=active]:shadow-sm">
          Pending Review ({pending.length})
        </TabsTrigger>
        <TabsTrigger value="reviewed" className="text-xs text-white/50 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white data-[state=active]:shadow-sm">
          Reviewed ({reviewed.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="mt-3 space-y-2">
        {pending.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/30">No pending candidates</p>
        ) : (
          pending.map((c) => (
            <CandidateRow
              key={c.id}
              candidate={c}
              blindMode={blindMode}
              showMatchScore={searchActive}
              onViewProfile={onViewProfile}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="reviewed" className="mt-3 space-y-2">
        {reviewed.length === 0 ? (
          <p className="py-8 text-center text-sm text-white/30">No reviewed candidates</p>
        ) : (
          reviewed.map((c) => (
            <CandidateRow
              key={c.id}
              candidate={c}
              blindMode={blindMode}
              showMatchScore={searchActive}
              onViewProfile={onViewProfile}
              onToggleStatus={onToggleStatus}
            />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
