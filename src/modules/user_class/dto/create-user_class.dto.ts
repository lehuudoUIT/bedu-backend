import { IsNotEmpty, IsNumber } from "class-validator";
import { Timestamp } from "typeorm";

export class CreateUserClassDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    classId: number;

    @IsNotEmpty()
    time: Timestamp;
}
