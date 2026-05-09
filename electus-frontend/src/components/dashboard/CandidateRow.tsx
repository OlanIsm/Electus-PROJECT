import { Link2, User } from "lucide-react";
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

  return (
    <div
      className="group flex items-center gap-4 rounded-xl glass px-5 py-4 cursor-pointer animate-fade-in"
      onClick={() => onViewProfile(candidate)}
    >
      {/* Avatar */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] border border-foreground/[0.1]">
        {blindMode ? (
          <User className="h-5 w-5 text-foreground/50" />
        ) : (
          <span className="text-sm font-semibold text-foreground/80">
            {candidate.fullName.split(" ").map((n) => n[0]).join("")}
          </span>
        )}
      </div>

      {/* Name + Skills */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground truncate">
            {displayName}
          </p>
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
        <div className="mt-1.5 flex flex-wrap gap-1.5">
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
      <div className="w-20 text-right shrink-0">
        {showMatchScore && candidate.matchScore !== null ? (
          <span className="text-lg font-bold text-primary">
            {candidate.matchScore}%
          </span>
        ) : (
          <span className="text-xs text-foreground/30">—</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8 glass-btn border-foreground/[0.1] text-foreground/80 hover:text-foreground"
          onClick={() => onViewProfile(candidate)}
        >
          View Profile
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
