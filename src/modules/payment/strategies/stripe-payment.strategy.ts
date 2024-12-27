import { PaymentStrategy } from './payment.strategy';

export class StripePaymentStrategy implements PaymentStrategy {
  async processPayment(amount: number): Promise<string> {
    return `Processed credit card payment of ${amount} successfully.`;
  }

  async confirmPayment(data: any): Promise<string> {
    return 'Confirm payment!';
  }
}
