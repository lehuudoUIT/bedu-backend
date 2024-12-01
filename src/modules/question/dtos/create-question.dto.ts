export class CreateQuestionDto {
  question: string;
  totalPoint: number;
  pointDivision: string;
  content: string;
  attach: string;
  questionType: string;
  answer: string;
  examId?: number[];
  documentId?: number[];
}
