import { Test, TestingModule } from '@nestjs/testing';
import { ExamService } from './exam.service';
import { QuestionService } from '../question/question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Exam } from '../../entities/exam.entity';

describe('ExamService', () => {
  let service: ExamService;

  const mockExamRepository = {};

  const mockQuestionService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExamService,
        {
          provide: getRepositoryToken(Exam),
          useValue: mockExamRepository
        },
        {
          provide: QuestionService,
          useValue: mockQuestionService
        }
      ],
    }).compile();

    service = module.get<ExamService>(ExamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
