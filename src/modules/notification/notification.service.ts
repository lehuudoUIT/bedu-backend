import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entities/notification.entity';
import { IsNull, Repository } from 'typeorm';
import {UsersService} from '../users/users.service';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UsersService,
  ) {} 

  async create(
    createNotificationDto: CreateNotificationDto
  ): Promise<ResponseDto> {
    try {
      const senderResponse = await this.userService.findUserById(createNotificationDto.senderId);
      if (senderResponse.statusCode !== 200) {
        return {
          statusCode: senderResponse.statusCode,
          message: senderResponse.message,
          data: null
        }
      }
      const sender = Array.isArray(senderResponse.data) 
                          ? senderResponse.data[0] 
                          : senderResponse.data;
      const receiverResponse = await this.userService.findUserById(createNotificationDto.receiverId);
      const receiver = Array.isArray(receiverResponse.data)
                          ? receiverResponse.data[0]
                          : receiverResponse.data;
      const newNotification = this.notificationRepository.create({
        ...createNotificationDto,
        sender,
        receiver
      });
      const result = await this.notificationRepository.save(newNotification);
      return {
        statusCode: 201,
        message: "Notification created successfully",
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

  async findAll(
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const notifications = await this.notificationRepository
                                      .createQueryBuilder('notification')
                                      .leftJoinAndSelect('notification.sender', 'sender')
                                      .leftJoinAndSelect('notification.receiver', 'receiver')
                                      .where('notification.deletedAt = :isDeleted', { isDeleted: false })
                                      .orderBy('notification.createdAt', 'DESC')
                                      .skip((page - 1) * limit)
                                      .take(limit)
                                      .getMany();
      if (notifications.length === 0) {
        return {
          statusCode: 404,
          message: "No notification found",
          data: null
        }
      }
      return {
        statusCode: 200,
        message: "Notifications retrieved successfully",
        data: notifications
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        data: null
      }
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const notification = await this.notificationRepository
                                    .findOneBy({
                                      id, 
                                      deletedAt: IsNull(),
                                      isActive: true
                                    })
      
      if (!notification) {
        return {
          statusCode: 404,
          message: "Notification not found",
          data: null
        }
      }
      return {
        statusCode: 200,
        message: "Notification retrieved successfully",
        data: notification
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Internal server error",
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateNotificationDto: UpdateNotificationDto
  ): Promise<ResponseDto> {
    const notificationResponse = await this.findOne(id);
    if (notificationResponse.statusCode !== 200) {
      return {
        statusCode: 404,
        message: "Notification not found",
        data: null
      }
    }
    const notification = Array.isArray(notificationResponse.data)
                              ? notificationResponse.data[0]
                              : notificationResponse.data;
    const senderResponse = await this.userService.findUserById(updateNotificationDto.senderId);
    if (senderResponse.statusCode !== 200) {
      return {
        statusCode: 404,
        message: "Failed to update notification because sender information is not found",
        data: null
      }
    }
    const sender = Array.isArray(senderResponse.data) 
                        ? senderResponse.data[0] 
                        : senderResponse.data;
    const receiverResponse = await this.userService.findUserById(updateNotificationDto.receiverId);
    if (receiverResponse.statusCode !== 200) {
      return {
        statusCode: 404,
        message: "Failed to update notification because receiver information is not found",
        data: null
      }
    }
    const receiver = Array.isArray(receiverResponse.data)
                        ? receiverResponse.data[0]
                        : receiverResponse.data;
    
    try {
      const updatedNotification = await this.notificationRepository.create({
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
      const notificationResponse = await this.findOne(id);
      if (notificationResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Notification not found",
          data: null
        }
      }
      const notification = Array.isArray(notificationResponse.data)
                              ? notificationResponse.data[0]
                              : notificationResponse.data;
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
}
