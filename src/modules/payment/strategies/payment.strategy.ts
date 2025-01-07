import { MomoPaymentStrategy } from './momo-payment.strategy';
import { PaypalPaymentStrategy } from './paypal-payment.strategy';
import { ZaloPaymentStrategy } from './zalo-payment.strategy';

// payment/strategies/payment.strategy.ts
export interface PaymentStrategy {
  processPayment(amount: number, content?: string): Promise<string>; // Kết quả xử lý thanh toán
  confirmPayment(data: any): Promise<any>; // Xác nhận thanh toán
}

// Add payment here
export const strategyType = {
  zalopay: ZaloPaymentStrategy,
  momo: MomoPaymentStrategy,
  paypal: PaypalPaymentStrategy,
};
