import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'programs' })
export class Program extends AbstractEntity<Program> {
  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  sessionQuantity: number;
}
