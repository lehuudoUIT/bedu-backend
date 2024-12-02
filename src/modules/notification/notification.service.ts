import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationDto } from './dtos/send-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';

import { IsNull, Repository } from 'typeorm';
import {UsersService} from '../users/users.service';
import { ResponseDto } from './common/response.interface';;
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { InsertNotificationDto } from './dtos/insert-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_SERVICE') 
    private rabbitClient: ClientProxy,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    
    private readonly userService: UsersService,
  ) {} 

  async create(
    createNotificationDto: InsertNotificationDto
  ) {
    const sender = await this.userService.findUserById(createNotificationDto.senderId);
    if (!sender) {
      throw new NotFoundException('Sender information is not found');
    }

    const receiver = await this.userService.findUserById(createNotificationDto.receiverId);
    if (!receiver) {
      throw new NotFoundException('Receiver information is not found');
    }

    const newNotification = this.notificationRepository.create({
      ...createNotificationDto,
      sender,
      receiver
    });
    const result = await this.notificationRepository.save(newNotification);
    if (!result) {
      throw new InternalServerErrorException('Failed to create notification');
    }
    return result;
  }

  async findAll_Base(
    page: number = 1,
    limit: number = 10,
  ) {
    const notifications = await this.notificationRepository
                                      .createQueryBuilder('notification')
                                      .leftJoinAndSelect('notification.sender', 'sender')
                                      .leftJoinAndSelect('notification.receiver', 'receiver')
                                      .where('notification.deletedAt IS NULL')
                                      .orderBy('notification.createdAt', 'DESC')
                                      .skip((page - 1) * limit)
                                      .take(limit)
                                      .getMany();
    if (notifications.length === 0) {
      throw new NotFoundException('Notification not found');
    }
    return notifications
  }

  async findOne(id: number) {
    const notification = await this.notificationRepository
                                    .findOneBy({
                                      id, 
                                      deletedAt: IsNull(),
                                      isActive: true
                                    })
      
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async update(
    id: number, 
    updateNotificationDto: UpdateNotificationDto
  ): Promise<ResponseDto> {
    const notification = await this.findOne(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const sender = await this.userService.findUserById(updateNotificationDto.senderId);
    if (!sender) {
      throw new NotFoundException('Sender information is not found');
    }

    const receiver = await this.userService.findUserById(updateNotificationDto.receiverId);
    if (!receiver) {
      return {
        statusCode: 404,
        message: "Failed to update notification because receiver information is not found",
        data: null
      }
    }
    
    try {
      const updatedNotification = this.notificationRepository.create({
        ...notification,
        ...updateNotificationDto,
        sender,
        receiver
      });
      const result = await this.notificationRepository.save(updatedNotification);
      return {
        statusCode: 200,
        message: "Notification updated successfully",
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        data: null
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const notification = await this.findOne(id);
      if (!notification) {
        throw new NotFoundException('Notification not found');
      }

      notification.deletedAt = new Date();
      notification.isActive = false;
      const result = await this.notificationRepository.save(notification);
      return {
        statusCode: 200,
        message: "Notification deleted successfully",
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        data: null
      }
    }
  }

  async sendNotification(notificationDto: NotificationDto) {
    //* Send a message to rabbitmq
    const { sendingType, content, subject } = notificationDto;

    try {
      if (sendingType == 'email') {
        //* find email of user
        const email = '';
        //* send to queue
        const payload = {
          recipient: email,
          message: content,
          subject,
        };

        const record = new RmqRecordBuilder(payload)
          .setOptions({
            expiration: 5000,
            persistent: true,
          })
          .build();
        this.rabbitClient.emit('notification.email', record);
      } else if (sendingType == 'sms') {
        //* find phone number of user
        const phoneNumber = '';
        //* send to queue
        const payload = {
          recipient: phoneNumber,
          message: content,
        };
        const record = new RmqRecordBuilder(payload)
          .setOptions({
            expiration: 5000,
            persistent: true,
          })
          .build();
        this.rabbitClient.emit('notification.sms', record);
      } else {
        //* find device token of user
        const deviceToken = '';
        //* send to queue
        const payload = {
          recipient: deviceToken,
          message: content,
        };
        const record = new RmqRecordBuilder(payload)
          .setOptions({
            expiration: 5000,
            persistent: true,
          })
          .build();
        this.rabbitClient.emit('notification.push', record);
        //* save to notification database
        const insertNotificationDto: InsertNotificationDto = {
          ...notificationDto,
          type: notificationDto.notiType,
          options: JSON.stringify(notificationDto.options),
        };

        await this.notificationRepository.insert(insertNotificationDto);
      }
    } catch (error) {
      throw new InternalServerErrorException('Fail to send notification!');
    }
  }

  async findAll(
    userId: number,
    page: number = 1,
    limit: number = 10
  ) {
    const notifications = await this.notificationRepository
                                    .createQueryBuilder('notification')
                                    .leftJoinAndSelect('notification.sender', 'sender')
                                    .leftJoinAndSelect('notification.receiver', 'receiver')
                                    .where('notification.deletedAt IS NULL')
                                    .andWhere('notification.isActive = :isActive', { isActive: true })
                                    .andWhere('notification.receiverId = :userId', { userId })
                                    .orderBy('notification.createdAt', 'DESC')
                                    .getMany();

    if (notifications.length == 0)
      throw new NotFoundException('User not found');
    else return notifications;
  }
}
