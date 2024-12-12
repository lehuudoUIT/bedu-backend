import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Exam } from './exam.entity';

@Entity({ name: 'scores' })
export class Score extends AbstractEntity<Score> {
  @Column()
  totalScore: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.score)
  user: User;

  @ManyToOne(
    () => Exam, 
    (exam) => exam.score,
    { eager: true }
  )
  exam: Exam;

} 
