import { LessonDocument } from './../../../entities/lesson_document.entity';

export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: LessonDocument | LessonDocument[];
}


