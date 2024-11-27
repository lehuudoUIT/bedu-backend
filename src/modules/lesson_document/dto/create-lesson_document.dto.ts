import { Timestamp } from "typeorm";

export class CreateLessonDocumentDto {
    lessonId: number;
    documentId: number;
    time: Timestamp;
}
