export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  skills: string[];
  hollandCode: {
    primary: string;
    label: string;
    distribution: { code: string; label: string; value: number; color: string }[];
  };
  hasPortfolio: boolean;
  portfolioUrl?: string;
  matchScore: number | null;
  status: "pending" | "reviewed";
  education: string;
  experience: string;
  aiSummary: string[];
}
