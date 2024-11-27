import { Timestamp } from "typeorm";

export class CreateScoreDto {
  totalScore: number; 
  userId: number;
  examId: number;
  description: string;
}
