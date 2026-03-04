import { useState, useMemo } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { SearchFilterBar } from "@/components/dashboard/SearchFilterBar";
import { CandidateList } from "@/components/dashboard/CandidateList";
import { CandidateDetailModal } from "@/components/dashboard/CandidateDetailModal";
import { candidates as initialCandidates } from "@/data/candidates";
import type { Candidate } from "@/types/candidate";

const Index = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [blindMode, setBlindMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [educationFilter, setEducationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const searchActive = searchQuery.trim().length > 0;

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (educationFilter !== "all" && c.education !== educationFilter) return false;
      if (experienceFilter !== "all" && c.experience !== experienceFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (searchActive) {
        const q = searchQuery.toLowerCase();
        const haystack = [c.name, ...c.skills, c.hollandCode.label, c.education, c.experience]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [candidates, searchQuery, educationFilter, experienceFilter, statusFilter, searchActive]);

  const toggleStatus = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "pending" ? "reviewed" : "pending" }
          : c
      )
    );
  };

  const pending = candidates.filter((c) => c.status === "pending").length;
  const reviewed = candidates.filter((c) => c.status === "reviewed").length;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-semibold text-white">Welcome back, HR Team</h1>
          <p className="mt-1 text-sm text-white/40">
            Manage your candidates and track hiring progress.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl glass px-4 py-3">
          <div className="text-right">
            <Label htmlFor="blind-mode" className="text-sm font-medium text-white/80 cursor-pointer">
              Blind Screening
            </Label>
            <p className="text-[11px] text-white/35">
              Hide names & photos for unbiased hiring
            </p>
          </div>
          <Switch
            id="blind-mode"
            checked={blindMode}
            onCheckedChange={setBlindMode}
          />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          educationFilter={educationFilter}
          onEducationChange={setEducationFilter}
          experienceFilter={experienceFilter}
          onExperienceChange={setExperienceFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatsCards
          totalCvs={candidates.length}
          pending={pending}
          reviewed={reviewed}
          interviewsSent={1}
        />
      </div>

      {/* Candidate List */}
      <div>
        <CandidateList
          candidates={filtered}
          blindMode={blindMode}
          searchActive={searchActive}
          onViewProfile={setSelectedCandidate}
          onToggleStatus={toggleStatus}
        />
      </div>

      {/* Detail Modal */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        open={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        blindMode={blindMode}
        onMarkDone={toggleStatus}
      />
    </DashboardLayout>
  );
};

export default Index;
