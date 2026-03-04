import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
  ) {}

  async create(data: Partial<Candidate>) {
    const candidate = this.candidateRepository.create(data);
    return this.candidateRepository.save(candidate);
  }

  async findAll() {
    return this.candidateRepository.find();
  }
}