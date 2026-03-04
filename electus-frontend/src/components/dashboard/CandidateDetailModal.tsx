import { Sparkles, ExternalLink, User, Link2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HollandChart } from "./HollandChart";
import type { Candidate } from "@/types/candidate";

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
  blindMode: boolean;
  onMarkDone: (id: string) => void;
}

export function CandidateDetailModal({
  candidate,
  open,
  onClose,
  blindMode,
  onMarkDone,
}: CandidateDetailModalProps) {
  if (!candidate) return null;

  const displayName = blindMode ? "Anonymous Candidate" : candidate.name;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden glass-strong border-white/[0.1] bg-[hsl(220,38%,10%)]/95 backdrop-blur-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.1]">
              {blindMode ? (
                <User className="h-5 w-5 text-white/50" />
              ) : (
                <span className="text-sm font-semibold text-white/80">
                  {candidate.name.split(" ").map((n) => n[0]).join("")}
                </span>
              )}
            </div>
            <div>
              <p className="text-base font-semibold text-white">{displayName}</p>
              <p className="text-sm font-normal text-white/40">
                {candidate.education} · {candidate.experience}
              </p>
            </div>
            {candidate.matchScore !== null && (
              <span className="ml-auto text-2xl font-bold text-primary">
                {candidate.matchScore}%
                <span className="ml-1 text-xs font-normal text-white/40">match</span>
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-5 gap-0">
          {/* Left Column */}
          <div className="col-span-3 border-r border-white/[0.06] p-6 space-y-5">
            {/* AI Summary */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-white/60" />
                <h3 className="text-sm font-semibold text-white">AI Summary</h3>
              </div>
              <ul className="space-y-2">
                {candidate.aiSummary.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-white/50 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            {candidate.hasPortfolio && candidate.portfolioUrl && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">Links</h3>
                <a
                  href={candidate.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Portfolio / Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="col-span-2 p-6 space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">
                Holland Code (RIASEC)
              </h3>
              <HollandChart distribution={candidate.hollandCode.distribution} />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-2">Key Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-[11px] font-medium bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/[0.1]">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 border-t border-white/[0.06] p-5">
          <Button className="flex-1 h-10 bg-primary/90 hover:bg-primary text-primary-foreground" onClick={onClose}>
            Send Interview Invite via Email
          </Button>
          <Button
            variant="outline"
            className="h-10 glass-btn border-white/[0.1] text-white/80 hover:text-white"
            onClick={() => {
              onMarkDone(candidate.id);
              onClose();
            }}
          >
            Done Reviewing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
