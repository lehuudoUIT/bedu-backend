export class CreatePaymentDto {
  userId: number;
  programCode: string;
  classCode: string;          
  amount: number;
  method: string;
  transactionId: string;
}
