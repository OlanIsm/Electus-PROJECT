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

const HOLLAND_COLORS: Record<string, string> = {
  R: '#E74C3C',
  I: '#3498DB',
  A: '#9B59B6',
  S: '#2ECC71',
  E: '#F39C12',
  C: '#1ABC9C',
};

const HOLLAND_LABELS: Record<string, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};

const HOLLAND_PERSONALITY: Record<string, string> = {
  R: 'Builder',
  I: 'Thinker',
  A: 'Creator',
  S: 'Helper',
  E: 'Persuader',
  C: 'Organizer',
};

const OLLAMA_URL = 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = 'gemma3:1b';

@Injectable()
export class GeminiService {
  async analyzeCv(cvText: string): Promise<CvAnalysis> {
    const prompt = `You are an expert HR analyst. Analyze the following CV/resume text and extract structured data.
Return ONLY a valid JSON object. No explanation, no markdown, no code blocks. Just raw JSON.

CV Text:
"""
${cvText.slice(0, 6000)}
"""

Return exactly this JSON structure:
{
  "fullName": "candidate full name or Unknown",
  "email": "email or empty string",
  "education": "one of: High School, Bachelor's, Master's, PhD, MBA, Other",
  "experience": "one of: Entry-level, Mid-level, Senior, Executive",
  "skills": ["skill1", "skill2", "skill3"],
  "aiSummary": [
    "First key insight about candidate (max 120 chars)",
    "Second key insight about candidate (max 120 chars)",
    "Third key insight about candidate (max 120 chars)"
  ],
  "hasPortfolio": false,
  "portfolioUrl": "",
  "hollandCode": {
    "primary": "one of: R, I, A, S, E, C",
    "distribution": {
      "R": 10,
      "I": 20,
      "A": 15,
      "S": 25,
      "E": 20,
      "C": 10
    }
  }
}

Rules:
- skills: 3 to 6 most relevant skills only
- aiSummary: 3 specific, concise insights
- distribution values must sum to 100
- hasPortfolio: true only if GitHub or portfolio URL found
- Return ONLY the JSON, nothing else`;

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: 'json',
        options: {
          temperature: 0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as { response: string };
    const parsed = JSON.parse(data.response);

    // Build hollandCode in the format the frontend expects
    const dist = parsed.hollandCode.distribution as Record<string, number>;
    const primaryCode: string = parsed.hollandCode.primary;

    const distribution = Object.entries(dist).map(([code, value]) => ({
      code,
      label: HOLLAND_LABELS[code] ?? code,
      value: Number(value),
      color: HOLLAND_COLORS[code] ?? '#888',
    }));

    return {
      fullName: parsed.fullName ?? 'Unknown',
      email: parsed.email ?? '',
      education: parsed.education ?? 'Other',
      experience: parsed.experience ?? 'Mid-level',
      skills: parsed.skills ?? [],
      aiSummary: parsed.aiSummary ?? [],
      hasPortfolio: parsed.hasPortfolio ?? false,
      portfolioUrl: parsed.portfolioUrl ?? '',
      hollandCode: {
        primary: primaryCode,
        label: HOLLAND_PERSONALITY[primaryCode] ?? primaryCode,
        distribution,
      },
    };
  }

  /**
   * Generate a vector embedding for text using Ollama's embedding API.
   * Uses the same model (gemma3:1b) so no extra model download needed.
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const payload = {
      model: 'nomic-embed-text',
      input: text.slice(0, 4000),
    };

    try {
      // Try /api/embed first (newer Ollama versions)
      let response = await fetch('http://localhost:11434/api/embed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Fallback to /api/embeddings (older Ollama versions)
      if (response.status === 404) {
        response = await fetch('http://localhost:11434/api/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: payload.model, prompt: payload.input }),
        });
      }

      if (!response.ok) {
        console.warn(`Embedding generation failed: ${response.status}`);
        return [];
      }

      const data = await response.json();
      // Handle both response formats
      return data.embeddings?.[0] ?? data.embedding ?? [];
    } catch (err) {
      console.warn('Embedding generation failed:', err);
      return [];
    }
  }

  /**
   * Calculate cosine similarity between two vectors.
   * Returns a value between 0 (no similarity) and 1 (identical).
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
