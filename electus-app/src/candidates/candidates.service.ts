import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Candidate } from './candidate.entity';
import { AiService } from '../ai/ai.service';
import { DocumentsService } from '../documents/documents.service';

@Injectable()
export class CandidatesService implements OnModuleInit {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    private aiService: AiService,
    private documentsService: DocumentsService,
  ) {}

  async onModuleInit() {
    await this.initDatabaseFunctions();
  }

  private async initDatabaseFunctions() {
    try {
      await this.candidateRepository.query(`
        CREATE OR REPLACE FUNCTION cosine_similarity(a double precision[], b double precision[])
        RETURNS double precision AS $$
        DECLARE
            dot_product double precision := 0;
            norm_a double precision := 0;
            norm_b double precision := 0;
            len integer;
            i integer;
        BEGIN
            IF a IS NULL OR b IS NULL THEN
                RETURN 0;
            END IF;
            len := array_length(a, 1);
            IF len IS NULL OR len != array_length(b, 1) THEN
                RETURN 0;
            END IF;

            FOR i IN 1..len LOOP
                dot_product := dot_product + (a[i] * b[i]);
                norm_a := norm_a + (a[i] * a[i]);
                norm_b := norm_b + (b[i] * b[i]);
            END LOOP;

            IF norm_a = 0 OR norm_b = 0 THEN
                RETURN 0;
            END IF;

            RETURN dot_product / (sqrt(norm_a) * sqrt(norm_b));
        END;
        $$ LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE;
      `);
      console.log('[CandidatesService] Database cosine_similarity function ready.');
    } catch (err) {
      console.warn('[CandidatesService] Could not initialize cosine_similarity function:', err);
    }
  }

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
    const result = await this.candidateRepository.delete({
      reviewStatus: status,
    });
    return {
      message: `Deleted ${result.affected ?? 0} candidates with status "${status}"`,
    };
  }

  async removeDuplicates() {
    // Group by fullName, keep only the latest (newest createdAt)
    const all = await this.candidateRepository.find({
      order: { createdAt: 'DESC' },
    });
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

  async uploadCv(file: Express.Multer.File): Promise<Candidate> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'cvs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const ext = path.extname(file.originalname) || (file.mimetype === 'application/pdf' ? '.pdf' : '.docx');
    const filename = `${randomUUID()}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    const cvFilePath = `/uploads/cvs/${filename}`;

    const baseName = path.parse(file.originalname).name;
    const candidate = this.candidateRepository.create({
      fullName: baseName,
      cvFilePath,
      reviewStatus: 'pending',
      processingStatus: 'processing',
      aiSummary: ['CV is being analyzed by AI in background...'],
    });

    const savedCandidate = await this.candidateRepository.save(candidate);

    // Fire async background processing without blocking the HTTP request
    this.processCandidateAsync(savedCandidate.id, file);

    return savedCandidate;
  }

  /**
   * Background processor for candidate CV (Text extraction, LLM analysis, Embedding)
   */
  async processCandidateAsync(candidateId: string, file: Express.Multer.File): Promise<void> {
    try {
      const cvText = await this.documentsService.extractText(file);
      const analysis = await this.aiService.analyzeCv(cvText);
      const embedding = await this.aiService.generateEmbedding(cvText);

      await this.candidateRepository.update(candidateId, {
        fullName: analysis.fullName && analysis.fullName !== 'Unknown' ? analysis.fullName : undefined,
        email: analysis.email || undefined,
        phone: analysis.phone || undefined,
        skills: analysis.skills || [],
        aiSummary: analysis.aiSummary || [],
        hollandCode: analysis.hollandCode,
        education: analysis.education,
        experience: analysis.experience,
        hasPortfolio: analysis.hasPortfolio,
        portfolioUrl: analysis.portfolioUrl,
        embedding,
        processingStatus: 'done',
        cvText,
      });
      console.log(`[CandidatesService] Completed background processing for candidate: ${candidateId}`);
    } catch (err) {
      console.error(`[CandidatesService] Error during background processing for candidate ${candidateId}:`, err);
      await this.candidateRepository.update(candidateId, {
        processingStatus: 'error',
        aiSummary: ['Failed to analyze CV with AI. Please retry upload.'],
      });
    }
  }

  /**
   * Hybrid Search: Combines semantic (vector) search with database text-match.
   * Execution is pushed down entirely to PostgreSQL — zero in-memory OOM risk.
   */
  async semanticSearch(query: string): Promise<Candidate[]> {
    console.log(`[Search] Query: "${query}"`);

    const queryLower = query.toLowerCase();
    const queryEmbedding = await this.aiService.generateEmbedding(query);
    const hasQueryEmbedding = Array.isArray(queryEmbedding) && queryEmbedding.length > 0;

    const parseJson = (val: any, fallback: any) => {
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return fallback;
        }
      }
      return val ?? fallback;
    };

    if (hasQueryEmbedding) {
      // Execute database-level vector search with SQL cosine_similarity
      // Excludes cvText & embedding from payload to minimize network & RAM usage
      const rawResults = await this.candidateRepository.query(
        `
        SELECT 
          c.id,
          c."fullName",
          c.email,
          c.phone,
          c."reviewStatus",
          c."processingStatus",
          c."aiSummary",
          c.skills,
          c."hollandCode",
          c.education,
          c.experience,
          c."portfolioUrl",
          c."hasPortfolio",
          c."cvFilePath",
          c."createdAt",
          cosine_similarity(c.embedding, $1::double precision[]) AS "semanticScore",
          CASE 
            WHEN LOWER(concat_ws(' ', c."fullName", c."cvText", c.skills, c.education, c.experience, c."aiSummary")) LIKE $2 
            THEN 0.5 
            ELSE 0.0 
          END AS "textScore"
        FROM candidate c
        WHERE c.embedding IS NOT NULL
        ORDER BY GREATEST(
          cosine_similarity(c.embedding, $1::double precision[]),
          CASE 
            WHEN LOWER(concat_ws(' ', c."fullName", c."cvText", c.skills, c.education, c.experience, c."aiSummary")) LIKE $2 
            THEN 0.5 
            ELSE 0.0 
          END
        ) DESC
        LIMIT 50
        `,
        [queryEmbedding, `%${queryLower}%`],
      );

      return rawResults
        .map((row: any) => {
          const semanticScore = parseFloat(row.semanticScore) || 0;
          const textScore = parseFloat(row.textScore) || 0;
          const combinedScore = Math.max(semanticScore, textScore);

          if (combinedScore < 0.40) return null;

          return {
            id: row.id,
            fullName: row.fullName,
            email: row.email,
            phone: row.phone,
            reviewStatus: row.reviewStatus,
            processingStatus: row.processingStatus,
            aiSummary: parseJson(row.aiSummary, []),
            skills: parseJson(row.skills, []),
            hollandCode: parseJson(row.hollandCode, null),
            education: row.education,
            experience: row.experience,
            portfolioUrl: row.portfolioUrl,
            hasPortfolio: row.hasPortfolio,
            cvFilePath: row.cvFilePath,
            createdAt: row.createdAt,
            matchScore: Math.round(combinedScore * 100),
          };
        })
        .filter(Boolean) as Candidate[];
    }

    // Fallback: If embedding generation is unavailable, perform text search in database
    const textResults = await this.candidateRepository.query(
      `
      SELECT 
        c.id,
        c."fullName",
        c.email,
        c.phone,
        c."reviewStatus",
        c."processingStatus",
        c."aiSummary",
        c.skills,
        c."hollandCode",
        c.education,
        c.experience,
        c."portfolioUrl",
        c."hasPortfolio",
        c."cvFilePath",
        c."createdAt"
      FROM candidate c
      WHERE LOWER(concat_ws(' ', c."fullName", c."cvText", c.skills, c.education, c.experience, c."aiSummary")) LIKE $1
      ORDER BY c."createdAt" DESC
      LIMIT 50
      `,
      [`%${queryLower}%`],
    );

    return textResults.map((row: any) => ({
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      reviewStatus: row.reviewStatus,
      processingStatus: row.processingStatus,
      aiSummary: parseJson(row.aiSummary, []),
      skills: parseJson(row.skills, []),
      hollandCode: parseJson(row.hollandCode, null),
      education: row.education,
      experience: row.experience,
      portfolioUrl: row.portfolioUrl,
      hasPortfolio: row.hasPortfolio,
      cvFilePath: row.cvFilePath,
      createdAt: row.createdAt,
      matchScore: 50,
    }));
  }

  // Unique Feature: Culture-Fit Matcher
  async getCultureFit(id: string, targetStr?: string) {
    const candidate = await this.findOne(id);
    if (!candidate.hollandCode || !candidate.hollandCode.distribution) {
      return { score: 0, target: {}, matchDetails: [] };
    }

    // Default Company Target Culture (e.g. Innovative Tech Startup)
    // Values represent ideal percentage distribution
    let TARGET_CULTURE: Record<string, number> = {
      I: 30, // Thinker / Problem Solver
      A: 25, // Creator / Innovator
      R: 20, // Builder / Doer
      E: 15, // Persuader / Leader
      S: 5,  // Helper
      C: 5   // Organizer
    };

    if (targetStr) {
      try {
        const customTarget: Record<string, number> = {};
        const pairs = targetStr.split(',');
        for (const pair of pairs) {
          const [key, val] = pair.split(':');
          if (key && val) {
            customTarget[key.trim().toUpperCase()] = Math.max(0, Math.min(100, parseFloat(val.trim())));
          }
        }
        if (Object.keys(customTarget).length > 0) {
          TARGET_CULTURE = customTarget;
        }
      } catch (err) {
        // Fallback to default TARGET_CULTURE
      }
    }

    let totalDifference = 0;
    const matchDetails: any[] = [];

    for (const dist of candidate.hollandCode.distribution) {
      const targetValue = TARGET_CULTURE[dist.code] || 0;
      const diff = Math.abs(dist.value - targetValue);
      totalDifference += diff;
      
      matchDetails.push({
        code: dist.code,
        label: dist.label,
        candidateValue: dist.value,
        targetValue,
        gap: targetValue - dist.value
      });
    }

    // Max possible difference is 200 (e.g., 100 in one trait, 0 in target, and vice versa)
    // Convert to a 0-100% fit score
    const score = Math.max(0, Math.round(100 - (totalDifference / 2)));

    return {
      score,
      target: TARGET_CULTURE,
      matchDetails: matchDetails.sort((a, b) => b.candidateValue - a.candidateValue)
    };
  }
}
