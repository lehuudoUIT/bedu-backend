import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'scores' })
export class Score extends AbstractEntity<Score> {
  @Column()
  totalScore: number;

  //Many to one
  @Column()
  userId: number;

  //Many to one
  @Column()
  examId: number;

  @Column()
  description: string;
}
