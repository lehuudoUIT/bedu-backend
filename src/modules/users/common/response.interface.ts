import {User} from '../../../entities/user.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: User[] | User;
}