import { Injectable } from '@nestjs/common';

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

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:3002';

@Injectable()
export class AiService {
  /**
   * Calls the AI Service microservice to analyze CV text.
   */
  async analyzeCv(cvText: string): Promise<CvAnalysis> {
    const response = await fetch(`${AI_SERVICE_URL}/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvText }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`AI Service error: ${response.status} - ${err}`);
    }

    return response.json() as Promise<CvAnalysis>;
  }

  /**
   * Calls the AI Service microservice to generate an embedding.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/ai/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.warn(`AI Service embedding failed: ${response.status}`);
        return [];
      }

      const data = (await response.json()) as { embedding: number[] };
      return data.embedding ?? [];
    } catch (err) {
      console.warn('Failed to call AI Service for embedding:', err);
      return [];
    }
  }

  /**
   * Cosine similarity stays here — it's pure math, no external dependency.
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (!a?.length || !b?.length || a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    return denominator === 0 ? 0 : dotProduct / denominator;
  }
}
