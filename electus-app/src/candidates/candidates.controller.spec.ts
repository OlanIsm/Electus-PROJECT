import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { EmailService } from './email.service';

const mockCandidatesService = {
  create: jest.fn(),
  uploadCv: jest.fn(),
  semanticSearch: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  updateStatus: jest.fn(),
  removeDuplicates: jest.fn(),
  removeAll: jest.fn(),
  removeByStatus: jest.fn(),
  remove: jest.fn(),
};

const mockEmailService = {
  sendInterviewInvite: jest.fn(),
};

describe('CandidatesController', () => {
  let controller: CandidatesController;
  const mockUser = { userId: 'user-1', email: 'test@example.com', companyId: 'company-123' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: mockCandidatesService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    controller = module.get<CandidatesController>(CandidatesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should call findAll if query is empty with tenant isolation', async () => {
      mockCandidatesService.findAll.mockResolvedValue([]);
      await controller.search('   ', mockUser);
      expect(mockCandidatesService.findAll).toHaveBeenCalledWith('company-123');
    });

    it('should call semanticSearch if query is provided with tenant isolation', async () => {
      mockCandidatesService.semanticSearch.mockResolvedValue([]);
      await controller.search('react', mockUser);
      expect(mockCandidatesService.semanticSearch).toHaveBeenCalledWith(
        'react',
        'company-123',
      );
    });
  });
});
