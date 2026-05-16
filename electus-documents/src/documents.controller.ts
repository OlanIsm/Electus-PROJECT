import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';

interface ExtractJsonBody {
  buffer: string; // base64 encoded
  filename: string;
  mimetype: string;
  size: number;
}

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  /** Health check */
  @Get('health')
  health() {
    return { status: 'ok', service: 'document-service' };
  }

  /**
   * POST /documents/extract (JSON body)
   * Accepts base64-encoded file data and returns extracted text.
   * Used by inter-service communication.
   */
  @Post('extract')
  async extract(@Body() body: ExtractJsonBody) {
    if (!body?.buffer || !body?.mimetype) {
      throw new BadRequestException('buffer and mimetype are required');
    }

    const fileBuffer = Buffer.from(body.buffer, 'base64');
    const text = await this.documentsService.extractText(
      fileBuffer,
      body.mimetype,
    );

    return {
      filename: body.filename,
      mimetype: body.mimetype,
      size: body.size,
      text,
    };
  }

  /**
   * POST /documents/extract-file (multipart upload)
   * Accepts a direct file upload (PDF/DOCX). For external/testing use.
   */
  @Post('extract-file')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
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
  async extractFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const text = await this.documentsService.extractText(
      file.buffer,
      file.mimetype,
    );

    return {
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      text,
    };
  }
}
