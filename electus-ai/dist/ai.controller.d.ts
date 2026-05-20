import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    health(): {
        status: string;
        service: string;
    };
    analyze(cvText: string): Promise<import("./ai.service").CvAnalysis | {
        error: string;
    }>;
    embed(text: string): Promise<{
        embedding: number[];
    }>;
}
