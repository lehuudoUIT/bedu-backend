import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'questions' })
export class Question extends AbstractEntity<Question> {
  @Column()
  questionType: string;

  @Column()
  question: string;

  @Column()
  score: number;

  @Column()
  content: string;

  @Column()
  attach: string;

  @Column()
  answer: string;
}
