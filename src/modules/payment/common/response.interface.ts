import { Payment } from 'src/entities/payment.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Payment[] | Payment;
}