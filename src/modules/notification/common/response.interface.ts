import { Notification } from './../../../entities/notification.entity';

export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Notification | Notification[];
}


