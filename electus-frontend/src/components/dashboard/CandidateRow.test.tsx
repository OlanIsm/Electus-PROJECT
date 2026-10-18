import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CandidateRow } from "./CandidateRow";
import type { Candidate } from "@/types/candidate";

const candidate: Candidate = {
  id: "candidate-1",
  fullName: "Alex Morgan",
  email: "alex@example.test",
  skills: ["React", "TypeScript"],
  hollandCode: { primary: "I", label: "Investigative", distribution: [] },
  hasPortfolio: false,
  matchScore: null,
  reviewStatus: "pending",
  processingStatus: "done",
  education: "Bachelor's",
  experience: "Senior",
  aiSummary: ["", "Alex Morgan builds accessible web applications."],
};

function setup(overrides: Partial<React.ComponentProps<typeof CandidateRow>> = {}) {
  const onViewProfile = vi.fn();
  const onToggleStatus = vi.fn();
  const result = render(<CandidateRow candidate={candidate} blindMode={false} showMatchScore={false}
    onViewProfile={onViewProfile} onToggleStatus={onToggleStatus} {...overrides} />);
  return { ...result, onViewProfile, onToggleStatus };
}

describe("CandidateRow preview", () => {
  it("shows the first nonempty summary above skills without an avatar", () => {
    const { container } = setup();
    const summary = screen.getByText(candidate.aiSummary[1]);
    expect(summary.compareDocumentPosition(screen.getByText("React")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelector(".candidate-avatar")).toBeNull();
  });

  it("does not expose an identifying AI summary in blind mode", () => {
    setup({ blindMode: true });
    expect(screen.getByText("Anonymous Candidate")).toBeInTheDocument();
    expect(screen.queryByText(/Alex Morgan/)).not.toBeInTheDocument();
    expect(screen.getByText("Senior · Bachelor's")).toBeInTheDocument();
  });

  it("falls back to structured profile details when the summary is missing", () => {
    setup({ candidate: { ...candidate, aiSummary: [] } });
    expect(screen.getByText("Senior · Bachelor's")).toBeInTheDocument();
  });

  it("keeps processing visible and disables profile opening", () => {
    setup({ candidate: { ...candidate, processingStatus: "processing" } });
    expect(screen.getByText("CV analysis is in progress.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Processing..." })).toBeDisabled();
  });

  it("preserves profile and review actions without triggering the row twice", () => {
    const { onViewProfile, onToggleStatus } = setup();
    fireEvent.click(screen.getByRole("button", { name: "View Profile" }));
    expect(onViewProfile).toHaveBeenCalledExactlyOnceWith(candidate);
    fireEvent.click(screen.getByRole("button", { name: "Mark Done" }));
    expect(onToggleStatus).toHaveBeenCalledExactlyOnceWith(candidate.id);
    expect(onViewProfile).toHaveBeenCalledTimes(1);
  });
});
