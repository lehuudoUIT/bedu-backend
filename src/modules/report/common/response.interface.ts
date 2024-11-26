import {Report} from '../../../entities/report.entity';
export interface ResponseDto {
    message: string;
    statusCode: number;
    data?: Report[] | Report;
}