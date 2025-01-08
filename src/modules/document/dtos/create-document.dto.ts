import {
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFiles,
} from '@nestjs/common';

export class CreateDocumentDto {
  documentType: string;
  code: string;
  title: string;
  content: string;
  attachFile: string;
  lessonId: number;
  questionId: number[];
}

export class UploadDocumentDto {
  documentType: string;
  title: string;
  content: string;
  lessonId: number;
}
