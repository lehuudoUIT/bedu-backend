import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { LessonController } from './lesson.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from 'src/entities/lesson.entity';
import { ClassModule } from '../class/class.module';
import { CourseModule } from '../course/course.module';
import { ExamModule } from '../exam/exam.module';
import { UsersModule } from '../users/users.module';
import { GoogleModule } from '../google/google.module';
import { UserClassModule } from '../user_class/user_class.module';
import { UserProgramModule } from '../user_program/user_program.module';
import { AnswerModule } from '../answer/answer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    ClassModule,
    CourseModule,
    ExamModule,
    UsersModule,
    GoogleModule,
    UserClassModule,
    UserProgramModule,
    AnswerModule
  ],
  controllers: [LessonController],
  providers: [LessonService],
  exports: [LessonService],
})
export class LessonModule {}
