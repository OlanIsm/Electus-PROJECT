import { Injectable, BadRequestException } from '@nestjs/common';
import * as mammoth from 'mammoth';

// pdf-parse v1.1.1 export
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse');

@Injectable()
export class DocumentsService {
  /**
   * Directly extracts raw text from PDF or DOCX file buffer in-memory.
   * Zero external HTTP network hops, zero base64 payload overhead.
   */
  async extractText(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file buffer provided for text extraction');
    }

    if (file.mimetype === 'application/pdf') {
      try {
        const parsed = await pdfParse(file.buffer);
        return parsed.text ?? '';
      } catch (err) {
        console.error('Failed to parse PDF document:', err);
        throw new BadRequestException('Failed to extract text from PDF document');
      }
    }

    if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      try {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result.value ?? '';
      } catch (err) {
        console.error('Failed to parse DOCX document:', err);
        throw new BadRequestException('Failed to extract text from DOCX document');
      }
    }

    throw new BadRequestException(`Unsupported file format: ${file.mimetype}`);
  }
}
