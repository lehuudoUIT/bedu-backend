import { Course } from '../../../entities/course.entity';

export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Course | Course[];
}