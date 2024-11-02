import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment extends AbstractEntity<Payment> {
  // Many - to - One
  @Column()
  userId: number;

  // Many - to - One
  @Column()
  programId: number;

  // Many - to - One
  @Column()
  classId: number;

  @Column()
  amount: number;

  @Column()
  method: string;

  @Column()
  transactionId: string;
}
