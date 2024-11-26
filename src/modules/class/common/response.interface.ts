import { Class } from 'src/entities/class.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Class[] | Class;
}