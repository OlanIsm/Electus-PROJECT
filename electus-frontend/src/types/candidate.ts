export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  skills: string[];
  hollandCode: {
    primary: string;
    label: string;
    distribution: { code: string; label: string; value: number; color: string }[];
  };
  hasPortfolio: boolean;
  portfolioUrl?: string;
  matchScore: number | null;
  reviewStatus: "pending" | "reviewed";
  processingStatus?: "pending" | "processing" | "done" | "error";
  education: string;
  experience: string;
  aiSummary: string[];
  cvText?: string;
  embedding?: number[];
  createdAt?: string;
}
