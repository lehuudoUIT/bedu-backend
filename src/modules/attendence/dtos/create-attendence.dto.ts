import { Timestamp } from "typeorm";

export class CreateAttendenceDto {
  lessonId: number;
  userId: number;
  time: Timestamp;
}
