import { Injectable } from '@nestjs/common';
import { CreateLessonDocumentDto } from './dto/create-lesson_document.dto';
import { UpdateLessonDocumentDto } from './dto/update-lesson_document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LessonDocument } from 'src/entities/lesson_document.entity';
import { Repository } from 'typeorm';
import { LessonService } from '../lesson/lesson.service';
import { DocumentService } from '../document/document.service';
import { ResponseDto } from './common/response.interface';

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
  ): Promise<ResponseDto> {
    try {
      const lessonResponse = await this.lessonService.findOne(createLessonDocumentDto.lessonId)
      if (lessonResponse.statusCode !== 200) {
        return {
          message: "Failed to create lesson document because lesson is not found",
          statusCode: 404,
          data: null,
        }
      }
      const lesson = Array.isArray(lessonResponse.data)
                    ? lessonResponse.data[0]
                    : lessonResponse.data;
      const documentResponse = await this.documentService.findOne(createLessonDocumentDto.documentId);
      if (documentResponse.statusCode !== 200) {
        return {
          message: "Failed to create lesson document because document is not found",
          statusCode: 404,
          data: null,
        }
      }
      const document = Array.isArray(documentResponse.data)
                    ? documentResponse.data[0]
                    : documentResponse.data;
      const newLessonDocument = this.lessonDocumentRepository.create({
        ...createLessonDocumentDto,
        lesson,
        document,
      });
      const result = await this.lessonDocumentRepository.save(newLessonDocument);
      return {
        message: "Lesson document created successfully",
        statusCode: 201,
        data: result,
      }

    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        data: null,
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
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
        return {
          message: "Lesson document not found",
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: "Lesson document found",
        statusCode: 200,
        data: lessonDocumentResponse,
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: 400,
        data: null,
      }
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const lessonDocumentResponse = await this.lessonDocumentRepository
                                                .findOneBy({
                                                  id,
                                                  deletedAt: null,
                                                  isActive: true,
                                                })
      if (!lessonDocumentResponse) {
        return {
          message: "Lesson document not found",
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: "Lesson document found",
        statusCode: 200,
        data: lessonDocumentResponse,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 400,
        data: null,
      }
    }
  }

  async update(
    id: number, 
    updateLessonDocumentDto: UpdateLessonDocumentDto
  ) {
    try {
      const lessonResponse = await this.lessonService.findOne(updateLessonDocumentDto.lessonId)
      if (lessonResponse.statusCode !== 200) {
        return {
          message: "Failed to create lesson document because lesson is not found",
          statusCode: 404,
          data: null,
        }
      }
      const lesson = Array.isArray(lessonResponse.data)
                    ? lessonResponse.data[0]
                    : lessonResponse.data;
      const documentResponse = await this.documentService.findOne(updateLessonDocumentDto.documentId);
      if (documentResponse.statusCode !== 200) {
        return {
          message: "Failed to create lesson document because document is not found",
          statusCode: 404,
          data: null,
        }
      }
      const document = Array.isArray(documentResponse.data)
                    ? documentResponse.data[0]
                    : documentResponse.data;
      const lessonDocumentResponse = await this.findOne(id);
      if (lessonDocumentResponse.statusCode !== 200) {
        return {
          message: "Lesson document not found",
          statusCode: 404,
          data: null,
        }
      }
      const lessonDocument = Array.isArray(lessonDocumentResponse.data)
                            ? lessonDocumentResponse.data[0]
                            : lessonDocumentResponse.data;
      const updatedLessonDocument = this.lessonDocumentRepository.merge(lessonDocument, {
        ...updateLessonDocumentDto,
        lesson,
        document,
      });
      const result = await this.lessonDocumentRepository.save(updatedLessonDocument);
      if(!result) {
        return {
          message: "Failed to update lesson document",
          statusCode: 400,
          data: null,
        }
      }
      return {
        message: "Lesson document updated successfully",
        statusCode: 200,
        data: result,
      }
    } catch(error ) {
      return {
        message: error.message,
        statusCode: 400,
        data: null,
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const lessonDocumentResponse = await this.findOne(id);
      if (lessonDocumentResponse.statusCode !== 200) {
        return {
          message: "Lesson document not found",
          statusCode: 404,
          data: null,
        }
      }
      const lessonDocument = Array.isArray(lessonDocumentResponse.data)
                            ? lessonDocumentResponse.data[0]
                            : lessonDocumentResponse.data;
      lessonDocument.isActive = false;
      lessonDocument.deletedAt = new Date();
      const result = await this.lessonDocumentRepository.save(lessonDocument);
      return {
        message: "Lesson document deleted successfully",
        statusCode: 200,
        data: result,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 400,
        data: null,
      }
    }
  }
}
