export class CreateAnswerDto {
  userId: number;
  examId: number;
  questionId: number;
  isCorrect: boolean;
  points: number;
}
