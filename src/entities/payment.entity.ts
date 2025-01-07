import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Program } from './program.entity';
import { Class } from './class.entity';
import { PaymentMethod } from './payment.method.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity({ name: 'payments' })
export class Payment extends AbstractEntity<Payment> {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.payments)
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: 'pending',
  })
  status: 'pending' | 'success' | 'failed';

  @Column()
  transactionId: string;

  @ManyToOne(() => User, (user) => user.payment, { eager: true })
  user: User;

  @ManyToOne(() => Program, (program) => program.payment, { eager: true })
  program: Program;

  @ManyToOne(() => Class, (class_) => class_.payment, { eager: true })
  class: Class;
}
