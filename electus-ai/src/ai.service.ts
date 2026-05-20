import { Injectable } from '@nestjs/common';

export interface CvAnalysis {
  fullName: string;
  email: string;
  phone: string;
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

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma3:1b';

@Injectable()
export class AiService {
  async analyzeCv(cvText: string): Promise<CvAnalysis> {
    const prompt = `You are a fair and objective HR analyst AI. Your role is to extract structured data from a CV.

CRITICAL ANTI-BIAS RULES — YOU MUST FOLLOW THESE STRICTLY:
- You are BLIND to: name, gender, age, race, ethnicity, nationality, religion, marital status, and university prestige/ranking.
- A candidate from an unknown university with strong skills MUST be treated identically to one from a top university.
- Do NOT mention the candidate's name, gender pronouns (he/she), or university name in the aiSummary.
- The aiSummary must ONLY describe demonstrated skills, technical competencies, work experience, and achievements.
- Do NOT make assumptions about a candidate's capability based on their name or background.
- Your only evaluation criteria are: skills demonstrated, years and quality of experience, and tangible achievements.

Return ONLY a valid JSON object. No explanation, no markdown, no code blocks. Just raw JSON.

CV Text:
"""
${cvText.slice(0, 6000)}
"""

Return exactly this JSON structure:
{
  "fullName": "candidate full name or Unknown",
  "email": "COPY the email address EXACTLY as it appears in the CV text. If no email is found, use empty string. DO NOT construct, guess, or infer an email address — only use what is explicitly written.",
  "phone": "COPY the phone number EXACTLY as it appears in the CV text. If no phone number is found, use empty string.",
  "education": "one of: High School, Bachelor's, Master's, PhD, MBA, Other",
  "experience": "one of: Entry-level, Mid-level, Senior, Executive",
  "skills": ["skill1", "skill2", "skill3"],
  "aiSummary": [
    "First insight: focus on a specific technical skill or achievement (max 120 chars)",
    "Second insight: focus on experience depth or domain expertise (max 120 chars)",
    "Third insight: focus on work style, collaboration, or impact (max 120 chars)"
  ],
  "hasPortfolio": false,
  "portfolioUrl": "COPY the portfolio/GitHub URL EXACTLY as it appears in the CV. Empty string if not found.",
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

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
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
      throw new Error(
        `Ollama error: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as { response: string };
    const parsed = JSON.parse(data.response);

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
      phone: parsed.phone ?? '',
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

  async generateEmbedding(text: string): Promise<number[]> {
    const payload = {
      model: 'nomic-embed-text',
      input: text.slice(0, 4000),
    };

    try {
      let response = await fetch(`${OLLAMA_URL}/api/embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 404) {
        response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
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
      return data.embeddings?.[0] ?? data.embedding ?? [];
    } catch (err) {
      console.warn('Embedding generation failed:', err);
      return [];
    }
  }
}
