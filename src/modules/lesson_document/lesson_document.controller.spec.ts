import { Test, TestingModule } from '@nestjs/testing';
import { LessonDocumentController } from './lesson_document.controller';
import { LessonDocumentService } from './lesson_document.service';

describe('LessonDocumentController', () => {
  let controller: LessonDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonDocumentController],
      providers: [LessonDocumentService],
    }).compile();

    controller = module.get<LessonDocumentController>(LessonDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
