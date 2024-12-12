import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';
import { UsersService } from '../users/users.service';
import { ProgramService } from '../program/program.service';
import { ClassService } from '../class/class.service';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockPaymentRepository = {};
  
  const mockUsersService = {};

  const mockProgramService = {};

  const mockClassService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: ProgramService,
          useValue: mockProgramService,
        },
        {
          provide: ClassService,
          useValue: mockClassService
        }
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
