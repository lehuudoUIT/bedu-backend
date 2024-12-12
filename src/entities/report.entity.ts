import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'reports' })
export class Report extends AbstractEntity<Report> {
  
  @Column()
  totalPayment: number;

  @Column()
  reportType: string;

  @ManyToOne(
    () => User, 
    (user) => user.report,
    { eager: true }
  )
  user: User;
}
