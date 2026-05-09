import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { GeminiService } from './gemini.service';

// pdf-parse@1.1.1 exports directly as a callable function
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string; numpages: number }>;

// mammoth for DOCX extraction
import * as mammoth from 'mammoth';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    private geminiService: GeminiService,
  ) {}

  async create(data: Partial<Candidate>) {
    const candidate = this.candidateRepository.create(data);
    return this.candidateRepository.save(candidate);
  }

  async findAll() {
    return this.candidateRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const candidate = await this.candidateRepository.findOne({ where: { id } });
    if (!candidate) throw new NotFoundException(`Candidate ${id} not found`);
    return candidate;
  }

  async updateStatus(id: string, reviewStatus: string) {
    const candidate = await this.findOne(id);
    candidate.reviewStatus = reviewStatus;
    return this.candidateRepository.save(candidate);
  }

  async remove(id: string) {
    const candidate = await this.findOne(id);
    await this.candidateRepository.remove(candidate);
    return { message: `Candidate ${id} deleted successfully` };
  }

  async removeAll() {
    const count = await this.candidateRepository.count();
    await this.candidateRepository.clear();
    return { message: `Deleted all ${count} candidates` };
  }

  async removeByStatus(status: string) {
    const result = await this.candidateRepository.delete({ reviewStatus: status });
    return { message: `Deleted ${result.affected ?? 0} candidates with status "${status}"` };
  }

  async removeDuplicates() {
    // Group by fullName, keep only the latest (newest createdAt)
    const all = await this.candidateRepository.find({ order: { createdAt: 'DESC' } });
    const seen = new Map<string, boolean>();
    const toDelete: string[] = [];

    for (const c of all) {
      if (seen.has(c.fullName)) {
        toDelete.push(c.id);
      } else {
        seen.set(c.fullName, true);
      }
    }

    if (toDelete.length > 0) {
      await this.candidateRepository.delete(toDelete);
    }

    return { message: `Removed ${toDelete.length} duplicate candidates` };
  }

  /**
   * Handles PDF/DOCX upload:
   * 1. Extracts text from PDF
   * 2. Sends text to Gemini for analysis
   * 3. Saves fully enriched candidate to DB
   */
  async uploadCv(file: Express.Multer.File): Promise<Candidate> {
    // Step 1: Extract text
    let cvText = '';
    if (file.mimetype === 'application/pdf') {
      const parsed = await pdfParse(file.buffer);
      cvText = parsed.text;
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      cvText = result.value;
    } else {
      cvText = `[File: ${file.originalname}] - Unsupported format.`;
    }

    // Step 2: Analyze with Gemini
    const analysis = await this.geminiService.analyzeCv(cvText);

    // Step 3: Generate vector embedding for semantic search
    const embedding = await this.geminiService.generateEmbedding(cvText);

    // Step 4: Save to DB
    const candidate = this.candidateRepository.create({
      fullName: analysis.fullName,
      email: analysis.email,
      cvText,
      reviewStatus: 'pending',
      skills: analysis.skills,
      aiSummary: analysis.aiSummary,
      hollandCode: analysis.hollandCode,
      education: analysis.education,
      experience: analysis.experience,
      hasPortfolio: analysis.hasPortfolio,
      portfolioUrl: analysis.portfolioUrl,
      embedding,
    });

    return this.candidateRepository.save(candidate);
  }

  /**
   * Hybrid Search: Combines semantic (vector) search with text-based search.
   * - Candidates WITH embeddings get a cosine similarity score
   * - ALL candidates also get a text-match boost
   * - Results are sorted by combined score
   */
  async semanticSearch(query: string): Promise<Candidate[]> {
    const allCandidates = await this.candidateRepository.find({
      order: { createdAt: 'DESC' },
    });

    console.log(`[Search] Query: "${query}", Total candidates: ${allCandidates.length}`);

    const queryLower = query.toLowerCase();

    // Step 1: Try to generate query embedding
    const queryEmbedding = await this.geminiService.generateEmbedding(query);
    const hasQueryEmbedding = queryEmbedding.length > 0;

    console.log(`[Search] Query embedding generated: ${hasQueryEmbedding} (${queryEmbedding.length} dims)`);

    // Step 2: Score each candidate
    const scored = allCandidates.map((c) => {
      let semanticScore = 0;
      let textScore = 0;

      // Semantic score (if both query and candidate have embeddings)
      if (hasQueryEmbedding && c.embedding?.length > 0) {
        semanticScore = this.geminiService.cosineSimilarity(queryEmbedding, c.embedding);
      }

      // Text-based score — search the FULL CV text + structured fields
      const haystack = [
        c.fullName ?? '',
        c.cvText ?? '',
        ...(c.skills ?? []),
        c.education ?? '',
        c.experience ?? '',
        ...(c.aiSummary ?? []),
      ].join(' ').toLowerCase();

      if (haystack.includes(queryLower)) {
        textScore = 0.5; // Boost for text match
      }

      const combinedScore = Math.max(semanticScore, textScore);
      return { candidate: c, score: combinedScore };
    });

    // Step 3: Filter out zero-score and sort by score descending
    const results = scored
      .filter(({ score }) => score > 0.01)
      .sort((a, b) => b.score - a.score);

    console.log(`[Search] Results found: ${results.length}`);

    // Step 4: Return as plain objects with matchScore
    return results.map(({ candidate, score }) => {
      const plain = JSON.parse(JSON.stringify(candidate));
      plain.matchScore = Math.round(score * 100);
      // Don't send huge embedding array to frontend
      delete plain.embedding;
      return plain;
    });
  }
}