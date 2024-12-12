import { Test, TestingModule } from '@nestjs/testing';
import { UserClassService } from './user_class.service';
import { UsersService } from '../users/users.service';
import { ClassService } from '../class/class.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserClass } from '../../entities/user_class.entity';

describe('UserClassService', () => {
  let service: UserClassService;
  const mockUserClassRepository = {};

  const mockUserService = {};

  const mockClassService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserClassService,
        {
          provide: getRepositoryToken(UserClass),
          useValue: mockUserClassRepository
        },
        {
          provide: UsersService,
          useValue: mockUserService
        },
        {
          provide: ClassService,
          useValue: mockClassService
        }
      ],
    }).compile();

    service = module.get<UserClassService>(UserClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
