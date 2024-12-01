import { Score } from 'src/entities/score.entity';

export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Score | Score[];
}


