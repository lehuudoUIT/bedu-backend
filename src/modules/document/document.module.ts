import { forwardRef, Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from 'src/entities/document.entity';
import { QuestionModule } from '../question/question.module';
import { LessonModule } from '../lesson/lesson.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
    forwardRef(() => QuestionModule),
    forwardRef(() => LessonModule)
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService]
})
export class DocumentModule {}
