export class CreateAnswerDto {
  userId: number;
  examId: number;
  questionId: number;
  points: number;
  content: string;
}
