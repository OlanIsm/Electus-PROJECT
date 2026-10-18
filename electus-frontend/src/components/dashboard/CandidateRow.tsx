import { ArrowUpRight, Link2, LoaderCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Candidate } from "@/types/candidate";

interface CandidateRowProps {
  candidate: Candidate;
  blindMode: boolean;
  showMatchScore: boolean;
  onViewProfile: (candidate: Candidate) => void;
  onToggleStatus: (id: string) => void;
}

export function CandidateRow({
  candidate,
  blindMode,
  showMatchScore,
  onViewProfile,
  onToggleStatus,
}: CandidateRowProps) {
  const displayName = blindMode ? "Anonymous Candidate" : candidate.fullName;
  const profileDescription = [candidate.experience, candidate.education].filter(Boolean).join(" · ");
  // Free-form AI summaries can contain names or contact details; keep blind previews structured.
  const description = candidate.processingStatus === "processing"
    ? "CV analysis is in progress."
    : candidate.processingStatus === "error"
      ? "CV analysis could not be completed."
      : (!blindMode && candidate.aiSummary?.find(point => point.trim()))
        || profileDescription
        || "No summary available yet.";

  return (
    <div
      className="candidate-row group flex items-center gap-4 rounded-xl glass px-5 py-4 cursor-pointer animate-fade-in"
      onClick={() => onViewProfile(candidate)}
    >
      {/* Name, preview, and skills */}
      <div className="candidate-identity flex-1 min-w-0">
        <div className="candidate-name flex items-center gap-2">
          <p className="text-lg font-semibold text-foreground truncate">
            {displayName}
          </p>
          {candidate.processingStatus === "processing" && (
            <LoaderCircle aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin text-primary" />
          )}
          {candidate.hasPortfolio && (
            <Link2 className="h-3.5 w-3.5 text-foreground/40 shrink-0" />
          )}
          {candidate.createdAt && (
            <span className="text-[10px] text-foreground/40 shrink-0">
              {new Date(candidate.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <p className="candidate-description mt-2 text-sm leading-relaxed text-foreground/70 line-clamp-2">
          {description}
        </p>
        <div className="candidate-skills mt-3 flex flex-wrap gap-1.5">
          {(candidate.skills ?? []).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-full bg-foreground/[0.06] border border-foreground/[0.08] px-2.5 py-0.5 text-[11px] font-medium text-foreground/70"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Holland Code */}
      {candidate.hollandCode ? (
        <Badge variant="outline" className="shrink-0 text-[11px] font-medium border-foreground/[0.1] bg-foreground/[0.04] text-foreground/70">
          {candidate.hollandCode.primary} – {candidate.hollandCode.label}
        </Badge>
      ) : (
        <Badge variant="outline" className="shrink-0 text-[11px] font-medium border-foreground/[0.1] bg-foreground/[0.04] text-foreground/40">
          N/A
        </Badge>
      )}

      {/* Match Score */}
      <div className="candidate-match w-20 text-right shrink-0" data-active={showMatchScore}>
        {showMatchScore && candidate.matchScore !== null ? (
          <span className="text-lg font-bold text-primary">
            {candidate.matchScore}%
          </span>
        ) : (
          <span className="text-xs text-foreground/30">—</span>
        )}
      </div>

      <div className="candidate-actions flex shrink-0 gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          disabled={candidate.processingStatus === "processing"}
          className="text-xs h-8 glass-btn border-foreground/[0.1] text-foreground/80 hover:text-foreground disabled:opacity-50"
          onClick={() => onViewProfile(candidate)}
        >
          {candidate.processingStatus === "processing" ? "Processing..." : "View Profile"}
          <ArrowUpRight aria-hidden="true" className="profile-arrow hidden h-4 w-4" />
        </Button>
        {candidate.reviewStatus === "pending" && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 text-foreground/40 hover:text-foreground hover:bg-foreground/[0.06]"
            onClick={() => onToggleStatus(candidate.id)}
          >
            Mark Done
          </Button>
        )}
      </div>
    </div>
  );
}
