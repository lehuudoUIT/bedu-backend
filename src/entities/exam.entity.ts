import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Question } from './question.entity';
import { Score } from './score.entity';
import { Lesson } from './lesson.entity';
import { Answer } from './answer.entity';

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
  resultTime: number;

  @Column()
  description: string;

  @ManyToMany(
    () => Question, 
    (question) => question.exam,
  )
  @JoinTable(
    {name: 'exams_questions'}
  )
  questions: Question[];

  @OneToMany(() => Score, (score) => score.exam)
  score: Score;

  @OneToMany(() => Lesson, (lesson) => lesson.exam)
  lesson: Lesson;

  @OneToMany(() => Answer, (answer) => answer.exam)
  answer: Answer[];

}
