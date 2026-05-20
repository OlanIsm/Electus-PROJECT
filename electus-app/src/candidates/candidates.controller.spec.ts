import { Test, TestingModule } from '@nestjs/testing';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';

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

describe('CandidatesController', () => {
  let controller: CandidatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatesController],
      providers: [
        {
          provide: CandidatesService,
          useValue: mockCandidatesService,
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
    it('should call findAll if query is empty', async () => {
      mockCandidatesService.findAll.mockResolvedValue([]);
      await controller.search('   ');
      expect(mockCandidatesService.findAll).toHaveBeenCalled();
    });

    it('should call semanticSearch if query is provided', async () => {
      mockCandidatesService.semanticSearch.mockResolvedValue([]);
      await controller.search('react');
      expect(mockCandidatesService.semanticSearch).toHaveBeenCalledWith(
        'react',
      );
    });
  });
});
