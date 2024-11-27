import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LessonDocumentService } from './lesson_document.service';
import { LessonDocumentController } from './lesson_document.controller';
import { LessonDocument } from 'src/entities/lesson_document.entity';
import { LessonModule } from '../lesson/lesson.module';
import { DocumentModule } from '../document/document.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonDocument]),
    LessonModule,
    DocumentModule
  ],
  controllers: [LessonDocumentController],
  providers: [LessonDocumentService],
  exports: [LessonDocumentService]
})
export class LessonDocumentModule {}
