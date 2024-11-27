import { Lesson } from './../../../entities/lesson.entity';

export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Lesson | Lesson[];
}


