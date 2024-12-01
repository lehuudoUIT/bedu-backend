import { IsNotEmpty, IsString } from "class-validator";
import { Timestamp } from "typeorm";

export class CreateUserProgramDto {
    @IsString()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    programId: number;

    @IsNotEmpty()
    time: Timestamp;
}
