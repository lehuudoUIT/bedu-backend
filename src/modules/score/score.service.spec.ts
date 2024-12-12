import { Test, TestingModule } from '@nestjs/testing';
import { ScoreService } from './score.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Score } from '../../entities/score.entity';
import { UsersService } from '../users/users.service';
import { ExamService } from '../exam/exam.service';

describe('ScoreService', () => {
  let service: ScoreService;
  const mockScoreRepository = {};

  const mockUserService = {};

  const mockExamService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoreService,
        {
          provide: getRepositoryToken(Score),
          useValue: mockScoreRepository
        },
        {
          provide: UsersService,
          useValue: mockUserService
        },
        {
          provide: ExamService,
          useValue: mockExamService
        }
      ],
    }).compile();

    service = module.get<ScoreService>(ScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
