import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonDocumentService } from './lesson_document.service';
import { LessonDocumentController } from './lesson_document.controller';
import { LessonDocument } from 'src/entities/lesson_document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonDocument])
  ],
  controllers: [LessonDocumentController],
  providers: [LessonDocumentService],
  exports: [LessonDocumentService]
})
export class LessonDocumentModule {}
