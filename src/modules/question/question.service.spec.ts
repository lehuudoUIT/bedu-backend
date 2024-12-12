import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import { ExamService } from '../exam/exam.service';
import { DocumentService } from '../document/document.service';

describe('QuestionService', () => {
  let service: QuestionService;

  const mockQuestionRepository = {};

  const mockExamService = {};

  const mockDocumentService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: getRepositoryToken(Question),
          useValue: mockQuestionRepository
        },
        {
          provide: ExamService,
          useValue: mockExamService
        },
        {
          provide: DocumentService,
          useValue: mockDocumentService
        }
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
