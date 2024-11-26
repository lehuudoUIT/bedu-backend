import { Test, TestingModule } from '@nestjs/testing';
import { UserProgramService } from './user_program.service';

describe('UserProgramService', () => {
  let service: UserProgramService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProgramService],
    }).compile();

    service = module.get<UserProgramService>(UserProgramService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
