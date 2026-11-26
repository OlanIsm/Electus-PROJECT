import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.GEMINI_MODEL;
    delete process.env.GEMINI_FALLBACK_MODEL;

    const module: TestingModule = await Test.createTestingModule({
      providers: [AiService],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cosineSimilarity', () => {
    it('should return 1 for identical vectors', () => {
      const vecA = [1, 2, 3];
      const vecB = [1, 2, 3];
      const result = service.cosineSimilarity(vecA, vecB);
      expect(result).toBeCloseTo(1);
    });

    it('should return 0 for orthogonal vectors', () => {
      const vecA = [1, 0];
      const vecB = [0, 1];
      const result = service.cosineSimilarity(vecA, vecB);
      expect(result).toBe(0);
    });

    it('should return 0 for empty vectors', () => {
      const result = service.cosineSimilarity([], []);
      expect(result).toBe(0);
    });

    it('should calculate correct similarity for arbitrary vectors', () => {
      const vecA = [1, 1];
      const vecB = [2, 2];
      const result = service.cosineSimilarity(vecA, vecB);
      expect(result).toBeCloseTo(1);
    });
  });

  describe('Gemini Integration', () => {
    it('should call Gemini generateContent and parse CV analysis', async () => {
      process.env.GEMINI_API_KEY = 'fake-gemini-key';

      const mockResponse = {
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        education: "Master's",
        experience: 'Senior',
        skills: ['TypeScript', 'NestJS'],
        aiSummary: ['Senior backend engineer with strong architecture skills.'],
        hasPortfolio: true,
        portfolioUrl: 'https://github.com/janesmith',
        hollandCode: {
          primary: 'I',
          distribution: { R: 10, I: 60, A: 10, S: 10, E: 5, C: 5 },
        },
      };

      const mockGenerateContent = jest.fn().mockResolvedValue({
        text: JSON.stringify(mockResponse),
      });

      (service as any).geminiClient = {
        models: {
          generateContent: mockGenerateContent,
        },
      };

      const result = await service.analyzeCv('cv text for Jane');
      expect(mockGenerateContent).toHaveBeenCalledWith(
        expect.objectContaining({ model: 'gemini-3.5-flash-lite' }),
      );
      expect(result.fullName).toBe('Jane Smith');
      expect(result.experience).toBe('Senior');
      expect(result.hollandCode.label).toBe('Thinker');
      expect(result.hollandCode.distribution.length).toBe(6);
    });

    it('falls back to Flash when Flash-Lite returns invalid JSON', async () => {
      process.env.GEMINI_API_KEY = 'fake-gemini-key';
      const generateContent = jest.fn()
        .mockResolvedValueOnce({ text: '' })
        .mockResolvedValueOnce({ text: '{"skills":[],"aiSummary":[]}' });
      (service as any).geminiClient = { models: { generateContent } };

      await expect(service.analyzeCv('CV text')).resolves.toMatchObject({ skills: [] });
      expect(generateContent.mock.calls.map(([request]) => request.model)).toEqual([
        'gemini-3.5-flash-lite', 'gemini-3.8-flash',
      ]);
    });

    it('should call Gemini embedContent and return vector values', async () => {
      process.env.GEMINI_API_KEY = 'fake-gemini-key';

      const mockEmbedContent = jest.fn().mockResolvedValue({
        embeddings: [{ values: [0.123, 0.456, 0.789] }],
      });

      (service as any).geminiClient = {
        models: {
          embedContent: mockEmbedContent,
        },
      };

      const result = await service.generateEmbedding('query text');
      expect(mockEmbedContent).toHaveBeenCalled();
      expect(result).toEqual([0.123, 0.456, 0.789]);
    });
  });
});
