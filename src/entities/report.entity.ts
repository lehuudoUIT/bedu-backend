import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'reports' })
export class Report extends AbstractEntity<Report> {
  //Many to one
  @Column()
  userId: number;

  @Column()
  totalPayment: number;

  @Column()
  reportType: string;
}
