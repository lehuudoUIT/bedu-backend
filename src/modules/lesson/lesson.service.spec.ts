import { Test, TestingModule } from '@nestjs/testing';
import { LessonService } from './lesson.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from '../../entities/lesson.entity';
import { ExamService } from '../exam/exam.service';
import { CourseService } from '../course/course.service';
import { ClassService } from '../class/class.service';
import { UsersService } from '../users/users.service';

describe('LessonService', () => {
  let service: LessonService;

  const mockLessonRepository = {};

  const mockExamService = {};

  const mockCourseService = {};

  const mockClassService = {};

  const mockUsersService = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: getRepositoryToken(Lesson),
          useValue: mockLessonRepository
        },
        {
          provide: ExamService,
          useValue: mockExamService
        },
        {
          provide: CourseService,
          useValue: mockCourseService
        },
        {
          provide: ClassService,
          useValue: mockClassService
        },
        {
          provide: UsersService,
          useValue: mockUsersService
        }
      ],
    }).compile();

    service = module.get<LessonService>(LessonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
