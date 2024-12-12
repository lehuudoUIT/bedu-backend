import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuestionService } from '../question/question.service';
import { Document } from '../../entities/document.entity';

describe('DocumentService', () => {
  let service: DocumentService;

  const mockDocumentRepository = {

  }

  const mockQuestionService = {
    
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        { 
            provide: getRepositoryToken(Document),
            useValue: mockDocumentRepository
        },
        {
            provide: QuestionService,
            useValue: mockQuestionService
        }
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
