import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from '../candidates/candidate.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  async getOverview() {
    const totalApplicants = await this.candidateRepository.count();
    
    // For a real app, these metrics would be derived from actual historical data.
    // For now, we mock the trends and secondary stats as requested.
    return {
      totalApplicants: {
        value: totalApplicants,
        trend: "+12% this month",
        isPositiveTrend: true
      },
      timeToHire: {
        value: 18,
        unit: "days",
        trend: "-3 days avg",
        isPositiveTrend: true
      },
      offerAcceptance: {
        value: 85,
        unit: "%",
        trend: "Steady",
        isPositiveTrend: null
      },
      activeRoles: {
        value: 12,
        trend: "3 urgent",
        isPositiveTrend: null
      }
    };
  }

  async getPipeline() {
    const candidates = await this.candidateRepository.find({ select: ['reviewStatus'] });
    const totalCount = candidates.length;
    
    let reviewedCount = 0;
    let interviewedCount = 0;

    for (const c of candidates) {
      // Assuming 'pending' means not yet reviewed.
      if (c.reviewStatus && c.reviewStatus.toLowerCase() !== 'pending') {
        reviewedCount++;
      }
      if (c.reviewStatus && c.reviewStatus.toLowerCase() === 'interviewed') {
        interviewedCount++;
      }
    }

    return {
      applied: {
        count: totalCount,
        percentage: totalCount > 0 ? 1.0 : 0
      },
      reviewed: {
        count: reviewedCount,
        percentage: totalCount > 0 ? Number((reviewedCount / totalCount).toFixed(2)) : 0
      },
      interviewed: {
        count: interviewedCount,
        percentage: totalCount > 0 ? Number((interviewedCount / totalCount).toFixed(2)) : 0
      }
    };
  }
}
