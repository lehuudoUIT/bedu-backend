export class CreatePaymentDto {
  userId: number;
  programId: number;
  classId: number;
  amount: number;
  method: string;
  transactionId: string;
}
