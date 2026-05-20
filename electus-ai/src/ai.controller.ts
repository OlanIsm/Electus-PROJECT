import { Controller, Post, Get, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  /** Health check */
  @Get('health')
  health() {
    return { status: 'ok', service: 'ai-service' };
  }

  /**
   * POST /ai/analyze
   * Analyze CV text and return structured candidate data.
   */
  @Post('analyze')
  async analyze(@Body('cvText') cvText: string) {
    if (!cvText) {
      return { error: 'cvText is required' };
    }
    return this.aiService.analyzeCv(cvText);
  }

  /**
   * POST /ai/embed
   * Generate a vector embedding for the given text.
   */
  @Post('embed')
  async embed(@Body('text') text: string) {
    if (!text) {
      return { embedding: [] };
    }
    const embedding = await this.aiService.generateEmbedding(text);
    return { embedding };
  }
}
