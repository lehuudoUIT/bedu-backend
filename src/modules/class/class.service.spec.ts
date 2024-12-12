import { Test, TestingModule } from '@nestjs/testing';
import { ClassService } from './class.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Class } from '../../entities/class.entity';

describe('ClassService', () => {
  let service: ClassService;
  const mockClassRepository = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClassService,
        {
          provide: getRepositoryToken(Class),
          useValue: mockClassRepository
        }
      ],
    }).compile();

    service = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
