import { Test, TestingModule } from '@nestjs/testing';
import { UserProgramController } from './user_program.controller';
import { UserProgramService } from './user_program.service';

describe('UserProgramController', () => {
  let controller: UserProgramController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProgramController],
      providers: [UserProgramService],
    }).compile();

    controller = module.get<UserProgramController>(UserProgramController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
