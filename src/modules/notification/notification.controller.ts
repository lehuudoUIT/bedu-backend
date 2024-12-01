import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dtos/send-notification.dto';
import { InsertNotificationDto } from './dtos/insert-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  
  @Post('new')
  create(@Body() createNotificationDto: InsertNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get('all')
  findAll(
    @Query  ('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.notificationService.findAll_Base(page, limit);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch('item/:id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
