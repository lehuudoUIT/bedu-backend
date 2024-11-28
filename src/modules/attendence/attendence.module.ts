import { Module } from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { AttendenceController } from './attendence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/entities/attendence.entity';
import { UsersModule } from '../users/users.module';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    UsersModule,
    LessonModule,
  ],
  controllers: [AttendenceController],
  providers: [AttendenceService],
})
export class AttendenceModule {}
