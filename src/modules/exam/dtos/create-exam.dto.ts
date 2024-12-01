export class CreateExamDto {
  title: string;
  examType: string;
  duration: number;
  maxTries: number;
  resultTime: number;
  description: string;
  questionId: number[];
}
