import { Attendance } from './../../../entities/attendence.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Attendance[] | Attendance;
}