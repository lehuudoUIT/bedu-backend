import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'exams' })
export class Exam extends AbstractEntity<Exam> {
  @Column()
  title: string;

  @Column()
  examType: string;

  @Column()
  duration: number;

  @Column()
  maxTries: number;

  @Column()
  scoringType: string;

  @Column()
  resultTime: number;

  @Column()
  description: string;
}
