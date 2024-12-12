import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from '../../entities/lesson.entity';
import {Comment} from '../../entities/comment.entity';

describe('CommentsService', () => {
  let service: CommentsService;
  const mockCommentRepository = {

  };

  const mockLessonRepository = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
            provide: getRepositoryToken(Comment),
            useValue: mockCommentRepository
        },
        {
            provide: getRepositoryToken(Lesson),
            useValue: mockLessonRepository
        }
    ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
