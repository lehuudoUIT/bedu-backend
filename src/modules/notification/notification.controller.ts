import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dtos/send-notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() notificationDto: NotificationDto) {
    return this.notificationService.sendNotification(notificationDto);
  }

  @Get(':id')
  async findAll(
    @Param('id') userId: number,
    @Query('take') take?: number,
    @Query('skip') skip?: number,
  ) {
    return await this.notificationService.findAll({
      userId,
      take,
      skip,
    });
  }
}
