// payment/payment.factory.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStrategy } from './strategies/payment.strategy';

@Injectable()
export class PaymentFactory {
  private strategies = new Map<string, PaymentStrategy>();

  registerPaymentMethod(
    method: string,
    paymentStrategy: PaymentStrategy,
  ): void {
    if (this.strategies.has(method))
      throw new BadRequestException('This method has been already registered!');
    console.log(`method::${method}::register::success`);

    this.strategies.set(method, paymentStrategy);
  }

  getPaymentMethod(method: string): PaymentStrategy {
    const strategy = this.strategies.get(method);
    if (!strategy) throw new NotFoundException('Strategy does not exist!');
    return strategy;
  }
}
