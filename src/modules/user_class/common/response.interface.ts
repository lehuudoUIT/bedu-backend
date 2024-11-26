import { UserClass } from 'src/entities/user_class.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: UserClass[] | UserClass;
}