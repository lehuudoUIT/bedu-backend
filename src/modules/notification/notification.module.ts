import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from 'src/entities/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UsersModule
],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService]
})
export class NotificationModule {}
