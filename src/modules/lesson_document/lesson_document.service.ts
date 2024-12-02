import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDocumentDto } from './dto/create-lesson_document.dto';
import { UpdateLessonDocumentDto } from './dto/update-lesson_document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonDocument } from 'src/entities/lesson_document.entity';
import { IsNull, Repository } from 'typeorm';
import { LessonService } from '../lesson/lesson.service';
import { DocumentService } from '../document/document.service';

@Injectable()
export class LessonDocumentService {

  constructor(
    @InjectRepository(LessonDocument)
    private readonly lessonDocumentRepository: Repository<LessonDocument>,
    private readonly lessonService: LessonService,
    private readonly documentService: DocumentService,
  ) {}

  async create(
    createLessonDocumentDto: CreateLessonDocumentDto
  ): Promise<LessonDocument> {
    const lesson = await this.lessonService.findOne(createLessonDocumentDto.lessonId)
    if (lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const document = await this.documentService.findOne(createLessonDocumentDto.documentId);
    if (!document) {
      throw new NotFoundException('Document not found');
    }

    const newLessonDocument = this.lessonDocumentRepository.create({
      ...createLessonDocumentDto,
      lesson,
      document,
    });
    const result = await this.lessonDocumentRepository.save(newLessonDocument);
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<LessonDocument[]> {
    const lessonDocumentResponse = await this.lessonDocumentRepository
                                              .createQueryBuilder('lesson_document')
                                              .leftJoinAndSelect('lesson_document.lesson', 'lesson')
                                              .leftJoinAndSelect('lesson_document.document', 'document')
                                              .where('lesson_document.deletedAt IS NULL')
                                              .where('lesson.isActive = :isActive', { isActive: true })
                                              .skip((page - 1) * limit)
                                              .take(limit)
                                              .getMany();
      if (lessonDocumentResponse.length === 0) {
        throw new NotFoundException('No lesson document found');
      }
      return lessonDocumentResponse;
  }

  async findOne(id: number): Promise<LessonDocument> {
    const lessonDocumentResponse = await this.lessonDocumentRepository
                                              .createQueryBuilder('lessonDocument')
                                              .leftJoinAndSelect('lessonDocument.lesson', 'lesson')
                                              .leftJoinAndSelect('lessonDocument.document', 'document')
                                              .where('lessonDocument.id = :id', { id })
                                              .andWhere('lessonDocument.deletedAt IS NULL')
                                              .andWhere('lessonDocument.isActive = :isActive', { isActive: true })
                                              .getOne();
    if (!lessonDocumentResponse) {
      throw new NotFoundException('Lesson document not found');
    }
    return lessonDocumentResponse;
  }

  async update(
    id: number, 
    updateLessonDocumentDto: UpdateLessonDocumentDto
  ): Promise<LessonDocument> {
    const lesson = await this.lessonService.findOne(updateLessonDocumentDto.lessonId)
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
 
      const document = await this.documentService.findOne(updateLessonDocumentDto.documentId);
      if (!document) {
        throw new NotFoundException('Document not found');
      }
      const lessonDocument = await this.findOne(id);
      if (!lessonDocument) {
        throw new NotFoundException('Lesson document not found');
      }

      const updatedLessonDocument = this.lessonDocumentRepository.merge(lessonDocument, {
        ...updateLessonDocumentDto,
        lesson,
        document,
      });
      const result = await this.lessonDocumentRepository.save(updatedLessonDocument);
      if(!result) {
        throw new NotFoundException('Lesson document not found');
      }
      return result;
  }

  async remove(id: number): Promise<LessonDocument> {
    const lessonDocument = await this.findOne(id);
    if (!lessonDocument) {
      throw new NotFoundException('Lesson document not found');
    }
    lessonDocument.isActive = false;
    lessonDocument.deletedAt = new Date();
    const result = await this.lessonDocumentRepository.save(lessonDocument);
    return result;
  }
}
