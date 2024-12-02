import { PartialType } from '@nestjs/mapped-types';
import { InsertNotificationDto } from './insert-notification.dto';

export class UpdateNotificationDto extends PartialType(InsertNotificationDto) {}
