import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    return await this.notificationRepository.insert(createNotificationDto);
  }

  async findAll() {
    return await this.notificationRepository.find();
  }

  async findOne(id: number) {
    return await this.notificationRepository.findOneBy({ id });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return await this.notificationRepository.update(
      { id },
      updateNotificationDto,
    );
  }

  async remove(id: number) {
    return await this.notificationRepository.delete({ id });
  }
}
