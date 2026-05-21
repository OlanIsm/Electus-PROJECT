import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';
import { EmailService } from './email.service';
import { Candidate } from './candidate.entity';

@Controller('candidates')
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
    private readonly emailService: EmailService,
  ) {}

  // POST /candidates
  @Post()
  create(@Body() body: Partial<Candidate>) {
    return this.candidatesService.create(body);
  }

  // POST /candidates/upload  — upload PDF/DOCX CV
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
      fileFilter: (_, file, cb) => {
        const allowed = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only PDF and DOCX files are allowed'),
            false,
          );
        }
      },
    }),
  )
  uploadCv(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.candidatesService.uploadCv(file);
  }

  // GET /candidates/search?q=...  — Semantic Search (RAG)
  @Get('search')
  search(@Query('q') query: string) {
    if (!query?.trim()) return this.candidatesService.findAll();
    return this.candidatesService.semanticSearch(query);
  }

  // GET /candidates
  @Get()
  findAll() {
    return this.candidatesService.findAll();
  }

  // GET /candidates/:id
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.candidatesService.findOne(id);
  }

  // PATCH /candidates/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reviewStatus') reviewStatus: string,
  ) {
    return this.candidatesService.updateStatus(id, reviewStatus);
  }

  // DELETE /candidates/duplicates
  @Delete('duplicates')
  removeDuplicates() {
    return this.candidatesService.removeDuplicates();
  }

  // DELETE /candidates/all
  @Delete('all')
  removeAll() {
    return this.candidatesService.removeAll();
  }

  // DELETE /candidates/status/:status
  @Delete('status/:status')
  removeByStatus(@Param('status') status: string) {
    return this.candidatesService.removeByStatus(status);
  }

  // DELETE /candidates/:id
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.candidatesService.remove(id);
  }

  // POST /candidates/:id/invite — send interview invite email
  @Post(':id/invite')
  async sendInvite(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { jobTitle: string; interviewDate: string; hrName: string; customMessage?: string },
  ) {
    const candidate = await this.candidatesService.findOne(id);
    if (!candidate.email) {
      return { success: false, message: 'Candidate has no email address on record.' };
    }
    const result = await this.emailService.sendInterviewInvite(
      candidate.fullName,
      candidate.email,
      body.jobTitle,
      body.interviewDate,
      body.hrName,
      body.customMessage,
    );
    return {
      success: true,
      sentTo: candidate.email,
      messageId: result.messageId,
      // previewUrl is only present in Ethereal demo mode
      previewUrl: result.previewUrl ?? null,
    };
  }

  @Get(':id/status')
  async getProcessingStatus(@Param('id', ParseUUIDPipe) id: string) {
    const candidate = await this.candidatesService.findOne(id);
    return {
      id: candidate.id,
      processingStatus: candidate.processingStatus,
      fullName: candidate.fullName
    };
  }

  // GET /candidates/:id/culture-fit
  @Get(':id/culture-fit')
  async getCultureFit(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('target') target?: string,
  ) {
    return this.candidatesService.getCultureFit(id, target);
  }
}
