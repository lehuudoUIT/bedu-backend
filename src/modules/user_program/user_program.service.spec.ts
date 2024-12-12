import { Test, TestingModule } from '@nestjs/testing';
import { UserProgramService } from './user_program.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProgram } from '../../entities/user_program.entity';
import { UsersService } from '../users/users.service';
import { ProgramService } from '../program/program.service';

describe('UserProgramService', () => {
  let service: UserProgramService;

  const mockUserProgramRepository = {}; 
  
  const mockUserService = {};

  const  mockProgramService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProgramService,
        {
          provide: getRepositoryToken(UserProgram),
          useValue: mockUserProgramRepository
        },
        {
          provide: UsersService,
          useValue: mockUserService
        },
        {
          provide: ProgramService,
          useValue: mockProgramService
        }
      ],
    }).compile();

    service = module.get<UserProgramService>(UserProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
