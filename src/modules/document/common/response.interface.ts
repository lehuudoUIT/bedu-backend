import { Document } from 'src/entities/document.entity';

export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Document | Document[];
}