import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Payment } from './payment.entity';
import { AbstractEntity } from 'src/database/abstract.entity';

@Entity({ name: 'payment_method' })
export class PaymentMethod extends AbstractEntity<PaymentMethod> {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payments: Payment[];
}
