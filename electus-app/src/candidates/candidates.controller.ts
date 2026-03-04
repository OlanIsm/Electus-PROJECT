import { Controller, Post, Get, Body } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { Candidate } from './candidate.entity';

@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  create(@Body() body: Partial<Candidate>) {
    return this.candidatesService.create(body);
  }

  @Get()
  findAll() {
    return this.candidatesService.findAll();
  }
}