import { Answer } from "src/entities/answer.entity";
import { QuestionStrategy } from "./question-strategy.interface";

export class FillInTheBlankChoice implements QuestionStrategy {
    calculateScore(
        studentAnswers: string[], 
        correctAnswers: string[],
        pointDivision: string[],
        total: number,
    ): number {

        if (correctAnswers.length !== pointDivision.length
            || correctAnswers.length !== pointDivision.length
        ) {
            throw new Error('Mismatch in length of studentAnswers, correctAnswers, and pointDivision');
          }

        let totalScore = 0;

        for (let i = 0; i < correctAnswers.length; i++) {
            const correctAnswer = correctAnswers[i].toLowerCase();
            const studentAnswer = studentAnswers[i].toLowerCase();
            const point = parseFloat(pointDivision[i]);
        
            if (studentAnswer === '@') {
                continue;
            }
        
            if (studentAnswer === correctAnswer) {
                totalScore += point;
            }
        }
      
        return totalScore;
    }
}