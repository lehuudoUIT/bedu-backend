import { Test, TestingModule } from '@nestjs/testing';
import { ProgramService } from './program.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Program } from '../../entities/program.entity';
import { CourseService } from '../course/course.service';

describe('ProgramService', () => {
  let service: ProgramService;

  const mockProgramRepository = {};

  const mockCourseService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramService,
        {
          provide: getRepositoryToken(Program),
          useValue: mockProgramRepository
        },
        {
          provide: CourseService,
          useValue: mockCourseService
        }
      ],
    }).compile();

    service = module.get<ProgramService>(ProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
