import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ClientProxy } from '@nestjs/microservices';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import {Notification} from "../../entities/notification.entity"
import { emit } from 'process';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockRabbitClient = {
    emit: jest.fn()
  };

  const mockNotificationRepository = {};

  const mockUserService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: 'NOTIFICATION_SERVICE',
          useValue: mockRabbitClient
        },
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository
        },
        {
          provide: UsersService,
          useValue: mockUserService
        }
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
