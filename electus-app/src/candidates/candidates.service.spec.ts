import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CandidatesService } from './candidates.service';
import { Candidate } from './candidate.entity';
import { AiService } from '../ai/ai.service';
import { DocumentsService } from '../documents/documents.service';

const mockCandidateRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  count: jest.fn(),
  clear: jest.fn(),
};

const mockAiService = {
  analyzeCv: jest.fn(),
  generateEmbedding: jest.fn(),
  cosineSimilarity: jest.fn(),
};

const mockDocumentsService = {
  extractText: jest.fn(),
};

describe('CandidatesService', () => {
  let service: CandidatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CandidatesService,
        {
          provide: getRepositoryToken(Candidate),
          useValue: mockCandidateRepository,
        },
        {
          provide: AiService,
          useValue: mockAiService,
        },
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    service = module.get<CandidatesService>(CandidatesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('semanticSearch', () => {
    it('should fallback to text search if query embedding fails', async () => {
      mockAiService.generateEmbedding.mockResolvedValue([]);

      const mockCandidates = [
        {
          id: '1',
          fullName: 'John',
          cvText: 'Experienced developer',
          skills: [],
          education: '',
          experience: '',
          aiSummary: [],
        },
      ];
      mockCandidateRepository.find.mockResolvedValue(mockCandidates);

      const result = await service.semanticSearch('john');

      expect(mockAiService.generateEmbedding).toHaveBeenCalledWith('john');
      expect(result).toHaveLength(1);
      expect(result[0].fullName).toEqual('John');
      expect(result[0].matchScore).toBe(50); // 0.5 * 100
    });

    it('should score and rank candidates based on semantic and text search', async () => {
      mockAiService.generateEmbedding.mockResolvedValue([0.1, 0.2]);

      const mockCandidates = [
        {
          id: '1',
          fullName: 'Backend Engineer',
          embedding: [0.1, 0.2],
          cvText: 'NestJS PostgreSQL',
          skills: ['Node.js'],
        },
        {
          id: '2',
          fullName: 'Frontend Dev',
          embedding: [-0.1, 0],
          cvText: 'React CSS',
          skills: ['React'],
        },
      ];

      mockCandidateRepository.find.mockResolvedValue(mockCandidates);

      // Mock cosine similarity to return 0.9 for candidate 1 and 0.1 for candidate 2
      mockAiService.cosineSimilarity.mockImplementation((q, e) => {
        if (e === mockCandidates[0].embedding) return 0.9;
        return 0.1;
      });

      const result = await service.semanticSearch('backend');

      expect(result).toHaveLength(2);
      expect(result[0].fullName).toBe('Backend Engineer');
      expect(result[0].matchScore).toBe(90); // 0.9 * 100
      expect(result[0].embedding).toBeUndefined(); // Should be removed from output

      expect(result[1].fullName).toBe('Frontend Dev');
      expect(result[1].matchScore).toBe(10); // 0.1 * 100
    });
  });

  describe('removeDuplicates', () => {
    it('should remove older duplicates of the same fullName', async () => {
      const mockCandidates = [
        { id: '1', fullName: 'John Doe', createdAt: new Date('2026-01-02') }, // keep this (newest)
        { id: '2', fullName: 'John Doe', createdAt: new Date('2026-01-01') }, // delete this
        { id: '3', fullName: 'Jane Doe', createdAt: new Date('2026-01-01') }, // keep this
      ];

      mockCandidateRepository.find.mockResolvedValue(mockCandidates);

      const result = await service.removeDuplicates();

      expect(mockCandidateRepository.delete).toHaveBeenCalledWith(['2']);
      expect(result.message).toBe('Removed 1 duplicate candidates');
    });
  });
});
