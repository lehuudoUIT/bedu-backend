import { PaymentStrategy } from './payment.strategy';

export class MomoPaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number): Promise<string> {
    return `Processed credit card payment of ${amount} successfully.`;
  }
}
