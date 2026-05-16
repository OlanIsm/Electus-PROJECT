import { Injectable } from '@nestjs/common';

const DOCUMENT_SERVICE_URL =
  process.env.DOCUMENT_SERVICE_URL || 'http://localhost:3003';

@Injectable()
export class DocumentsService {
  /**
   * Calls the Document Service microservice to extract text from a file.
   * Sends file as base64 JSON to avoid multipart/FormData issues in Node.js.
   */
  async extractText(file: Express.Multer.File): Promise<string> {
    try {
      const response = await fetch(
        `${DOCUMENT_SERVICE_URL}/documents/extract`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            buffer: file.buffer.toString('base64'),
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          }),
        },
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Document Service error: ${response.status} - ${err}`);
      }

      const data = (await response.json()) as { text: string };
      return data.text;
    } catch (error) {
      console.error('Failed to call Document Service:', error);
      throw error;
    }
  }
}
