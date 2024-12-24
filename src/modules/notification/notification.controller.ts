import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseFilters,
  UseInterceptors,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationDto } from './dtos/send-notification.dto';
import { InsertNotificationDto } from './dtos/insert-notification.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('notifications')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'notification',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createNotificationDto: InsertNotificationDto) {
    return {
      message: 'Create new notification successfully',
      metadata: await this.notificationService.create(createNotificationDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'notification',
    possession: 'own',
  })
  @Get('all/user/:userId')
  async findAll(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Find the list of notifications successfully',
      metadata: await this.notificationService.findAll(
        userId,
        page,
        limit,
        status,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'notification',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find a notification successfully',
      metadata: await this.notificationService.findOne(+id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'notification',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return {
      message: 'Update a notification successfully',
      metadata: await this.notificationService.update(
        +id,
        updateNotificationDto,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'notification',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete a notification successfully',
      metadata: await this.notificationService.remove(+id),
    };
  }
}
