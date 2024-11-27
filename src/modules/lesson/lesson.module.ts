import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/entities/lesson.entity';
import { ClassModule } from '../class/class.module';
import { CourseModule } from '../course/course.module';
import { ExamModule } from '../exam/exam.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    ClassModule,
    CourseModule, 
    ExamModule,   
    UsersModule
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService]  
})
export class LessonModule {}
