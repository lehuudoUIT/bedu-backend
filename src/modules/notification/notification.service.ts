import { Inject, Injectable } from '@nestjs/common';
import { NotificationDto } from './dtos/send-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { InsertNotificationDto } from './dtos/insert-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @Inject('NOTIFICATION_SERVICE') private rabbitClient: ClientProxy,
  ) {}

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
          options: '',
        };

        this.notificationRepository.insert(insertNotificationDto);
      }
    } catch (error) {
      console.error('Failed to send test event:', error.message);
    }
    return 'Send message to queue successfully!';
  }

  async findAll({ userId, take = 10, skip = 0 }) {
    const result = await this.notificationRepository.find({
      where: {
        receiverId: userId,
      },
      take,
      skip,
    });

    return result;
  }
}
