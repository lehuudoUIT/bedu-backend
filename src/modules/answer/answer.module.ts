import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { Answer } from 'src/entities/answer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionModule } from '../question/question.module';
import { UsersModule } from '../users/users.module';
import { ExamModule } from '../exam/exam.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer]),
    QuestionModule,
    UsersModule,
    ExamModule
],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
