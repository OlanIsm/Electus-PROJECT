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
  NotFoundException,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';
import { EmailService } from './email.service';
import { Candidate } from './candidate.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { InviteCandidateDto } from './dto/invite-candidate.dto';

@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
    private readonly emailService: EmailService,
  ) {}

  // POST /candidates
  @Post()
  create(@Body() body: Partial<Candidate>, @CurrentUser() user: any) {
    return this.candidatesService.create(body, user?.companyId);
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
  uploadCv(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.candidatesService.uploadCv(file, user?.companyId);
  }

  // GET /candidates/search?q=...  — Semantic Search (RAG)
  @Get('search')
  search(@Query('q') query: string, @CurrentUser() user: any) {
    if (!query?.trim()) return this.candidatesService.findAll(user?.companyId);
    return this.candidatesService.semanticSearch(query, user?.companyId);
  }

  // GET /candidates
  @Get()
  findAll(@CurrentUser() user: any) {
    return this.candidatesService.findAll(user?.companyId);
  }

  // GET /candidates/:id
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.candidatesService.findOne(id, user?.companyId);
  }

  // PATCH /candidates/:id/status
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reviewStatus') reviewStatus: string,
    @CurrentUser() user: any,
  ) {
    return this.candidatesService.updateStatus(id, reviewStatus, user?.companyId);
  }

  // DELETE /candidates/duplicates
  @Delete('duplicates')
  @Roles(UserRole.ADMIN)
  removeDuplicates(@CurrentUser() user: any) {
    return this.candidatesService.removeDuplicates(user?.companyId);
  }

  // DELETE /candidates/all
  @Delete('all')
  @Roles(UserRole.ADMIN)
  removeAll(@CurrentUser() user: any) {
    return this.candidatesService.removeAll(user?.companyId);
  }

  // DELETE /candidates/status/:status
  @Delete('status/:status')
  @Roles(UserRole.ADMIN)
  removeByStatus(@Param('status') status: string, @CurrentUser() user: any) {
    return this.candidatesService.removeByStatus(status, user?.companyId);
  }

  // DELETE /candidates/:id
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.candidatesService.remove(id, user?.companyId);
  }

  // POST /candidates/:id/invite — send interview invite email
  @Post(':id/invite')
  async sendInvite(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: InviteCandidateDto,
    @CurrentUser() user: any,
  ) {
    const candidate = await this.candidatesService.findOne(id, user?.companyId);
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
  async getProcessingStatus(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    const candidate = await this.candidatesService.findOne(id, user?.companyId);
    return {
      id: candidate.id,
      processingStatus: candidate.processingStatus,
      fullName: candidate.fullName,
    };
  }

  // GET /candidates/:id/culture-fit
  @Get(':id/culture-fit')
  async getCultureFit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Query('target') target?: string,
  ) {
    return this.candidatesService.getCultureFit(id, target, user?.companyId);
  }

  // GET /candidates/:id/cv — Stream / Download original CV file
  @Get(':id/cv')
  async downloadCv(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: any,
    @Res() res: any,
  ) {
    const candidate = await this.candidatesService.findOne(id, user?.companyId);
    if (!candidate.cvFilePath) {
      throw new NotFoundException('No CV file found for this candidate');
    }
    const fullPath = path.join(process.cwd(), candidate.cvFilePath);
    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('CV file not found on disk');
    }
    return res.sendFile(fullPath);
  }
}
