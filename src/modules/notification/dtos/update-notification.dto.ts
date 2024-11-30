import { PartialType } from '@nestjs/mapped-types';
import { NotificationDto } from './send-notification.dto';

export class UpdateNotificationDto extends PartialType(NotificationDto) {}
