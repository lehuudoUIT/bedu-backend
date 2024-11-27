import { Exam } from '../../../entities/exam.entity';

export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Exam | Exam[];
}