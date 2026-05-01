import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';
import { GeminiService } from './gemini.service';

// pdf-parse@1.1.1 exports directly as a callable function
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse') as (buffer: Buffer) => Promise<{ text: string; numpages: number }>;

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
    } else {
      cvText = `[File: ${file.originalname}] - DOCX text extraction coming soon.`;
    }

    // Step 2: Analyze with Gemini
    const analysis = await this.geminiService.analyzeCv(cvText);

    // Step 3: Save to DB
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
    });

    return this.candidateRepository.save(candidate);
  }
}