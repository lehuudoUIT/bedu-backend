import { Test, TestingModule } from '@nestjs/testing';
import { CourseService } from './course.service';
import { ProgramService } from '../program/program.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from '../../entities/course.entity';

describe('CourseService', () => {
  let service: CourseService;

  const mockCourseRepository = {

  }

  const mockProgramService = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourseService,
        { 
            provide: getRepositoryToken(Course),
            useValue: mockCourseRepository
        },
        {
            provide: ProgramService,
            useValue: mockProgramService
        }
      ],
    }).compile();

    service = module.get<CourseService>(CourseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
