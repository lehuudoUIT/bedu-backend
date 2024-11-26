import { Question } from 'src/entities/question.entity';

export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Question | Question[];
}


