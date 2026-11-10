import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;

  beforeEach(async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.AI_PROVIDER;

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

  describe('generateEmbedding (Ollama)', () => {
    it('should call fetch and return embeddings array', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ embeddings: [[0.1, 0.2, 0.3]] }),
      });

      const result = await service.generateEmbedding('test text');
      expect(global.fetch).toHaveBeenCalled();
      expect(result).toEqual([0.1, 0.2, 0.3]);
    });

    it('should fallback to /api/embeddings if /api/embed returns 404', async () => {
      global.fetch = jest
        .fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ embedding: [0.4, 0.5, 0.6] }),
        });

      const result = await service.generateEmbedding('test text');
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual([0.4, 0.5, 0.6]);
    });

    it('should return empty array on fetch failure', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      const result = await service.generateEmbedding('test text');
      expect(result).toEqual([]);
    });
  });

  describe('analyzeCv (Ollama)', () => {
    it('should parse Ollama JSON response and transform holland code', async () => {
      const mockResponse = {
        fullName: 'John Doe',
        email: 'john@example.com',
        education: 'Bachelor',
        experience: 'Entry-level',
        skills: ['React', 'Node.js'],
        aiSummary: ['Good developer'],
        hasPortfolio: true,
        portfolioUrl: 'github.com',
        hollandCode: {
          primary: 'I',
          distribution: { R: 10, I: 50, A: 10, S: 10, E: 10, C: 10 },
        },
      };

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: jest
          .fn()
          .mockResolvedValue({ response: JSON.stringify(mockResponse) }),
      });

      const result = await service.analyzeCv('my cv text');
      expect(global.fetch).toHaveBeenCalled();

      expect(result.fullName).toBe('John Doe');
      expect(result.hollandCode.primary).toBe('I');
      expect(result.hollandCode.label).toBe('Thinker');
      expect(result.hollandCode.distribution.length).toBe(6);
      expect(
        result.hollandCode.distribution.find((d) => d.code === 'I')?.value,
      ).toBe(50);
    });
  });

  describe('Gemini Integration', () => {
    it('should call Gemini generateContent and parse CV analysis', async () => {
      process.env.GEMINI_API_KEY = 'fake-gemini-key';
      process.env.AI_PROVIDER = 'gemini';

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
      expect(mockGenerateContent).toHaveBeenCalled();
      expect(result.fullName).toBe('Jane Smith');
      expect(result.experience).toBe('Senior');
      expect(result.hollandCode.label).toBe('Thinker');
      expect(result.hollandCode.distribution.length).toBe(6);
    });

    it('should call Gemini embedContent and return vector values', async () => {
      process.env.GEMINI_API_KEY = 'fake-gemini-key';
      process.env.AI_PROVIDER = 'gemini';

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
