import { UserProgram } from 'src/entities/user_program.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: UserProgram[] | UserProgram;
}