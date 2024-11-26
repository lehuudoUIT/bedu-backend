import { Program } from 'src/entities/program.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Program[] | Program;
}