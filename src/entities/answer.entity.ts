import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'answer' })
export class Answer extends AbstractEntity<Answer> {
  // Many to one
  @Column()
  userId: number;

  // Many to one
  @Column()
  examId: number;

  // Many to one
  @Column()
  questionId: number;

  @Column()
  isCorrect: boolean;

  @Column()
  points: number;
}
