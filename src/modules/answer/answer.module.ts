import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer } from 'src/entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from '../question/question.module';
import { UsersModule } from '../users/users.module';
import { ExamModule } from '../exam/exam.module';
import { ClassModule } from '../class/class.module';
import { CourseModule } from '../course/course.module';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer]),
    QuestionModule,
    UsersModule,
    ExamModule,
    ClassModule,
    CourseModule,
   // LessonModule
],
  controllers: [AnswerController],
  providers: [AnswerService],
  exports: [AnswerService]
})
export class AnswerModule {}
