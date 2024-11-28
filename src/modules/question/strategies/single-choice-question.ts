import { Answer } from "src/entities/answer.entity";
import { QuestionStrategy } from 'src/modules/question/strategies/question-strategy.interface';


export class SingleChoice implements QuestionStrategy {
    calculateScore(
        studentAnswers: string[], 
        correctAnswers: string[],
        pointDivision: string[],
        total: number,
    ): number { 
        if (correctAnswers.length !== 1
            || studentAnswers.length !== 1
            || pointDivision.length !== 1) {
            throw new Error('Single choice question should have only one answer');
        } 

        return studentAnswers[0] === correctAnswers[0] ? total : 0;
    }
}
