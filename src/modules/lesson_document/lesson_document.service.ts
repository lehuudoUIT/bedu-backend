import { Injectable } from '@nestjs/common';
import { CreateLessonDocumentDto } from './dto/create-lesson_document.dto';
import { UpdateLessonDocumentDto } from './dto/update-lesson_document.dto';

@Injectable()
export class LessonDocumentService {
  create(createLessonDocumentDto: CreateLessonDocumentDto) {
    return 'This action adds a new lessonDocument';
  }

  findAll() {
    return `This action returns all lessonDocument`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lessonDocument`;
  }

  update(id: number, updateLessonDocumentDto: UpdateLessonDocumentDto) {
    return `This action updates a #${id} lessonDocument`;
  }

  remove(id: number) {
    return `This action removes a #${id} lessonDocument`;
  }
}
