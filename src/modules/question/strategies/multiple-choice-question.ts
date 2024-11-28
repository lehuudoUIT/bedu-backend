import { Answer } from "src/entities/answer.entity";
import { QuestionStrategy } from "./question-strategy.interface";

export class MultipleChoice implements QuestionStrategy {
    calculateScore(
        studentAnswers: string[], 
        correctAnswers: string[],
        pointDivision: string[],
        total: number,
    ): number {
        if (correctAnswers.length !== correctAnswers.length)
        {
          throw new Error('Mismatch in length of studentAnswers and correctAnswers');
        }
        let flag = true;

        for (let i = 0; i < correctAnswers.length; i++) {
            const correctAnswer = correctAnswers[i];
            const studentAnswer = studentAnswers[i];
            const point = parseFloat(pointDivision[i]);
    
            if (studentAnswer === '@' || studentAnswer !== correctAnswer) {
              flag = false;
              break;
            }
        }
        
        if (flag) {
          return total;
        } else {
          return 0;
        }
    }
}