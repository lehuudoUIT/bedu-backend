import { Answer } from 'src/entities/answer.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Answer[] | Answer;
}