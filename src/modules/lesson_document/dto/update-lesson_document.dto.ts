import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDocumentDto } from './create-lesson_document.dto';

export class UpdateLessonDocumentDto extends PartialType(CreateLessonDocumentDto) {}
