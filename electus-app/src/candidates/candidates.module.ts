import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './candidate.entity';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';
import { EmailService } from './email.service';
import { AiModule } from '../ai/ai.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate]), AiModule, DocumentsModule],
  controllers: [CandidatesController],
  providers: [CandidatesService, EmailService],
})
export class CandidatesModule {}
