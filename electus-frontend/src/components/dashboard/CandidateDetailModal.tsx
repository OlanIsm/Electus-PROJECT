import { useState } from "react";
import { Sparkles, ExternalLink, User, Link2, Mail, Calendar, Briefcase, CheckCircle2, AlertCircle, Loader2, MessageSquare, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HollandChart } from "./HollandChart";
import type { Candidate } from "@/types/candidate";

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  open: boolean;
  onClose: () => void;
  blindMode: boolean;
  onMarkDone: (id: string) => void;
}

type InviteStep = "idle" | "confirm" | "sending" | "success" | "error";

export function CandidateDetailModal({
  candidate,
  open,
  onClose,
  blindMode,
  onMarkDone,
}: CandidateDetailModalProps) {
  const [inviteStep, setInviteStep] = useState<InviteStep>("idle");
  const [jobTitle, setJobTitle] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [hrName, setHrName] = useState(
    () => localStorage.getItem("electus-user-name") ?? "HR Team"
  );
  const [resultData, setResultData] = useState<{
    sentTo: string;
    previewUrl?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  if (!candidate) return null;

  const displayName = blindMode ? "Anonymous Candidate" : candidate.fullName;

  const handleSendInvite = async () => {
    setInviteStep("sending");
    try {
      const res = await fetch(
        `http://localhost:3000/candidates/${candidate.id}/invite`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobTitle, interviewDate, hrName, customMessage: inviteMessage }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.message ?? "Failed to send email.");
        setInviteStep("error");
        return;
      }
      setResultData({ sentTo: data.sentTo, previewUrl: data.previewUrl });
      setInviteStep("success");
    } catch (err) {
      setErrorMsg("Network error. Is the backend running?");
      setInviteStep("error");
    }
  };

  const resetInvite = () => {
    setInviteStep("idle");
    setJobTitle("");
    setInterviewDate("");
    setInviteMessage("");
    setResultData(null);
    setErrorMsg("");
  };

  const handleClose = () => {
    resetInvite();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden glass-strong border-foreground/[0.1] bg-background/95 backdrop-blur-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-foreground/[0.06]">
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/[0.06] border border-foreground/[0.1]">
                {blindMode ? (
                  <User className="h-5 w-5 text-foreground/50" />
                ) : (
                  <span className="text-sm font-semibold text-foreground/80">
                    {candidate.fullName.split(" ").map((n) => n[0]).join("")}
                  </span>
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">{displayName}</p>
                <p className="text-sm font-normal text-foreground/40">
                  {candidate.education} · {candidate.experience}
                </p>
              </div>
              {candidate.matchScore !== null && (
                <span className="ml-auto text-2xl font-bold text-primary">
                  {candidate.matchScore}%
                  <span className="ml-1 text-xs font-normal text-foreground/40">match</span>
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-5 gap-0">
            {/* Left Column */}
            <div className="col-span-3 border-r border-foreground/[0.06] p-6 space-y-5">
              {/* AI Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-foreground/60" />
                  <h3 className="text-sm font-semibold text-foreground">AI Summary</h3>
                </div>
                <ul className="space-y-2">
                  {(candidate.aiSummary ?? []).map((point, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground/50 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email */}
              {candidate.email && !blindMode && (
                <div className="flex items-center gap-2 text-sm text-foreground/40">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{candidate.email}</span>
                </div>
              )}

              {candidate.phone && !blindMode && (
                <div className="flex items-center gap-2 text-sm text-foreground/40 mt-1">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{candidate.phone}</span>
                </div>
              )}

              {/* Links */}
              {candidate.hasPortfolio && candidate.portfolioUrl && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Links</h3>
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
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Holland Code (RIASEC)
                </h3>
                {candidate.hollandCode ? (
                  <HollandChart distribution={candidate.hollandCode.distribution} />
                ) : (
                  <p className="text-sm text-foreground/30">Not available yet</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Key Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {(candidate.skills ?? []).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-[11px] font-medium bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/70 hover:bg-foreground/[0.1]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-3 border-t border-foreground/[0.06] p-5">
            <Button
              className="flex-1 h-10 bg-primary/90 hover:bg-primary text-primary-foreground gap-2"
              onClick={() => setInviteStep("confirm")}
            >
              <Mail className="h-4 w-4" />
              Send Interview Invite via Email
            </Button>
            <Button
              variant="outline"
              className="h-10 glass-btn border-foreground/[0.1] text-foreground/80 hover:text-foreground"
              onClick={() => { onMarkDone(candidate.id); handleClose(); }}
            >
              Done Reviewing
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Confirmation / Sending / Result Dialog ── */}
      <Dialog open={inviteStep !== "idle"} onOpenChange={() => { if (inviteStep !== "sending") resetInvite(); }}>
        <DialogContent className="sm:max-w-[460px] glass-strong border-foreground/[0.1] bg-background/95 backdrop-blur-2xl">

          {/* Step: Confirm — fill in details */}
          {inviteStep === "confirm" && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  Send Interview Invitation
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-1 mt-1">
                <p className="text-sm text-foreground/50">
                  Sending to: <span className="text-foreground font-medium">
                    {blindMode ? "Candidate's email (hidden)" : (candidate.email || "⚠ No email on record")}
                  </span>
                </p>
              </div>
              <div className="space-y-4 mt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground/60 flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3" /> Position / Job Title
                  </Label>
                  <Input
                    id="invite-job-title"
                    placeholder="e.g. Senior Fullstack Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="bg-foreground/[0.04] border-foreground/[0.1] text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground/60 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Interview Date & Time
                  </Label>
                  <Input
                    id="invite-interview-date"
                    placeholder="e.g. Monday, June 2, 2025 at 10:00 AM"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="bg-foreground/[0.04] border-foreground/[0.1] text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground/60 flex items-center gap-1.5">
                    <User className="h-3 w-3" /> Your Name (HR Contact)
                  </Label>
                  <Input
                    id="invite-hr-name"
                    value={hrName}
                    onChange={(e) => setHrName(e.target.value)}
                    className="bg-foreground/[0.04] border-foreground/[0.1] text-foreground"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-foreground/60 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Custom Message (optional)
                  </Label>
                  <Textarea
                    id="invite-message"
                    placeholder="Add a personal note to the candidate... e.g. 'We were impressed by your portfolio and would love to discuss your experience further.'"
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    rows={4}
                    className="bg-foreground/[0.04] border-foreground/[0.1] text-foreground text-sm resize-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="ghost" className="flex-1 text-foreground/60" onClick={resetInvite}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                  disabled={!jobTitle || !interviewDate || !!(!candidate.email)}
                  onClick={handleSendInvite}
                >
                  <Mail className="h-4 w-4" />
                  Confirm & Send
                </Button>
              </div>
              {!candidate.email && (
                <p className="text-xs text-destructive text-center -mt-1">
                  ⚠ This candidate has no email address — cannot send invite.
                </p>
              )}
            </>
          )}

          {/* Step: Sending */}
          {inviteStep === "sending" && (
            <div className="py-10 flex flex-col items-center gap-4 text-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-foreground font-medium">Sending invitation...</p>
              <p className="text-sm text-foreground/40">Please wait</p>
            </div>
          )}

          {/* Step: Success */}
          {inviteStep === "success" && resultData && (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20">
                <CheckCircle2 className="h-8 w-8 text-teal-400" />
              </div>
              <div>
                <p className="text-foreground font-semibold text-lg">Invitation Sent!</p>
                <p className="text-sm text-foreground/50 mt-1">
                  Email delivered to <span className="text-foreground font-medium">{resultData.sentTo}</span>
                </p>
              </div>
              {resultData.previewUrl && (
                <a
                  href={resultData.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Preview sent email (demo mode)
                </a>
              )}
              <Button className="mt-2 bg-primary/90 hover:bg-primary" onClick={handleClose}>
                Done
              </Button>
            </div>
          )}

          {/* Step: Error */}
          {inviteStep === "error" && (
            <div className="py-8 flex flex-col items-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <p className="text-foreground font-semibold">Failed to Send</p>
                <p className="text-sm text-foreground/50 mt-1">{errorMsg}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={resetInvite}>Cancel</Button>
                <Button className="bg-primary/90 hover:bg-primary" onClick={handleSendInvite}>
                  Retry
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
