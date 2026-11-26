import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandidateRow } from "./CandidateRow";
import type { Candidate } from "@/types/candidate";

interface CandidateListProps {
  candidates: Candidate[];
  blindMode: boolean;
  searchActive: boolean;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  onViewProfile: (candidate: Candidate) => void;
  onToggleStatus: (id: string) => void;
}

const views = [
  { value: "all", label: "All candidates" },
  { value: "pending", label: "Pending review" },
  { value: "reviewed", label: "Reviewed" },
];

export function CandidateList({
  candidates, blindMode, searchActive, statusFilter, onStatusChange, onViewProfile, onToggleStatus,
}: CandidateListProps) {
  const groups = views.map(view => ({
    ...view,
    rows: view.value === "all" ? candidates : candidates.filter(candidate => candidate.reviewStatus === view.value),
  }));

  return (
    <Tabs value={statusFilter} onValueChange={onStatusChange} className="candidate-tabs">
      <TabsList aria-label="Candidate review status">
        {groups.map(view => (
          <TabsTrigger key={view.value} value={view.value}>{view.label} <span>{view.rows.length}</span></TabsTrigger>
        ))}
      </TabsList>
      {groups.map(view => (
        <TabsContent key={view.value} value={view.value}>
          {view.rows.map(candidate => (
            <CandidateRow key={candidate.id} candidate={candidate} blindMode={blindMode}
              showMatchScore={searchActive} onViewProfile={onViewProfile} onToggleStatus={onToggleStatus} />
          ))}
          {!view.rows.length && <p className="px-4 py-10 text-center text-sm text-muted-foreground">No candidates in this view.</p>}
        </TabsContent>
      ))}
    </Tabs>
  );
}
