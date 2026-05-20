"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const HOLLAND_COLORS = {
    R: '#E74C3C',
    I: '#3498DB',
    A: '#9B59B6',
    S: '#2ECC71',
    E: '#F39C12',
    C: '#1ABC9C',
};
const HOLLAND_LABELS = {
    R: 'Realistic',
    I: 'Investigative',
    A: 'Artistic',
    S: 'Social',
    E: 'Enterprising',
    C: 'Conventional',
};
const HOLLAND_PERSONALITY = {
    R: 'Builder',
    I: 'Thinker',
    A: 'Creator',
    S: 'Helper',
    E: 'Persuader',
    C: 'Organizer',
};
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';
let AiService = class AiService {
    async analyzeCv(cvText) {
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
    "Third insight: focus on work style, collaboration, or impact (max 120 chars)",
    "Fourth insight: focus on notable projects, leadership, or problem-solving (max 120 chars)",
    "Fifth insight: focus on education, certifications, or unique strengths (max 120 chars)"
  ],
  "hasPortfolio": false,
  "portfolioUrl": "COPY the portfolio, GitHub, Vercel, or personal website URL EXACTLY as it appears in the CV. Empty string if not found.",
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
- aiSummary: 5 specific, concise insights
- distribution values must sum to 100
- hasPortfolio: MUST be set to true if a portfolio or code link is found in the CV text.
- portfolioUrl: Extract the exact link FROM THE CV TEXT. DO NOT invent links. DO NOT use examples. If no link is in the CV, use an empty string.
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
            throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        const parsed = JSON.parse(data.response);
        const dist = parsed.hollandCode.distribution;
        const primaryCode = parsed.hollandCode.primary;
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
    async generateEmbedding(text) {
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
        }
        catch (err) {
            console.warn('Embedding generation failed:', err);
            return [];
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)()
], AiService);
//# sourceMappingURL=ai.service.js.map