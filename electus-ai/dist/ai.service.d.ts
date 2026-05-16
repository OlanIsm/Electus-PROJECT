export interface CvAnalysis {
    fullName: string;
    email: string;
    education: string;
    experience: string;
    skills: string[];
    aiSummary: string[];
    hasPortfolio: boolean;
    portfolioUrl: string;
    hollandCode: {
        primary: string;
        label: string;
        distribution: {
            code: string;
            label: string;
            value: number;
            color: string;
        }[];
    };
}
export declare class AiService {
    analyzeCv(cvText: string): Promise<CvAnalysis>;
    generateEmbedding(text: string): Promise<number[]>;
}
