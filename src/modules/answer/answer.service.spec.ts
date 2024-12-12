import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from './answer.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Answer } from '../../entities/answer.entity';
import { QuestionService } from '../question/question.service';
import { UsersService } from '../users/users.service';
import { ExamService } from '../exam/exam.service';

describe('AnswerService', () => {
  let service: AnswerService;

  const mockAnswerRepository = {

  }

  const mockQuestionService = {

  }

  const mockUserService = {

  }

  const mockExamService = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerService,
        {
          provide: getRepositoryToken(Answer),
          useValue: mockAnswerRepository,
        }, 
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: ExamService,
          useValue: mockExamService,
        }
      ],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
