import { MomoPaymentStrategy } from './momo-payment.strategy';
import { StripePaymentStrategy } from './stripe-payment.strategy';
import { ZaloPaymentStrategy } from './zalo-payment.strategy';

// payment/strategies/payment.strategy.ts
export interface PaymentStrategy {
  processPayment(amount: number, content?: string): Promise<string>; // Kết quả xử lý thanh toán
}

// Add payment here
export const strategyType = {
  zalopay: ZaloPaymentStrategy,
  momo: MomoPaymentStrategy,
  stripe: StripePaymentStrategy,
};
