import { Test, TestingModule } from '@nestjs/testing';
import { LessonDocumentService } from './lesson_document.service';

describe('LessonDocumentService', () => {
  let service: LessonDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonDocumentService],
    }).compile();

    service = module.get<LessonDocumentService>(LessonDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
