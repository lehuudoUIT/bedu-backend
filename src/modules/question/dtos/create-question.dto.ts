export class CreateQuestionDto {
  question: string;
  totalPoints: number;
  pointDivision: string;
  content: string;
  attach: string;
  questionType: string;
  answer: string;
  examId?: number[];
  documentId?: number[];
  possibleAnswer: string;
}
