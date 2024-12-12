import { Test, TestingModule } from '@nestjs/testing';
import { AttendenceService } from './attendence.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Attendance } from '../../entities/attendence.entity';
import { UsersService } from '../users/users.service';
import { LessonService } from '../lesson/lesson.service';

describe('AttendenceService', () => {
  let service: AttendenceService;

  const mockAttendancesRepository = {

  }

  const mockUserService = {

  }

  const mockLessonService = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendenceService,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockAttendancesRepository
        },
        {
          provide: UsersService,
          useValue: mockUserService
        },
        {
          provide: LessonService,
          useValue: mockLessonService
        }
      ],
    }).compile();

    service = module.get<AttendenceService>(AttendenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
