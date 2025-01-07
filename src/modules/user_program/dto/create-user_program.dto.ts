import { IsNotEmpty, IsString } from 'class-validator';
import { Timestamp } from 'typeorm';

export class CreateUserProgramDto {
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  programId: number;

  @IsNotEmpty()
  time: Date;
}
