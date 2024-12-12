import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Program } from './program.entity';
import { Class } from './class.entity';

@Entity({ name: 'payments' })
export class Payment extends AbstractEntity<Payment> {

  @Column()
  amount: number;

  @Column()
  method: string;

  @Column()
  transactionId: string;

  @ManyToOne(
    () => User, 
    (user) => user.payment,
    { eager: true }
  )
  user: User;

  @ManyToOne(
    () => Program, 
    (program) => program.payment,
    { eager: true }
  )
  program: Program;

  @ManyToOne(
    () => Class, 
    (class_) => class_.payment,
    { eager: true }
  )
  class: Class;
  
}
