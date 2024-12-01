import { Answer } from 'src/entities/answer.entity';

export interface QuestionStrategy {
    calculateScore(
        studentAnswers: string[], 
        correctAnswers: string[],
        pointDivision: string[],
        totalPoint: number,
    ): number;
}
