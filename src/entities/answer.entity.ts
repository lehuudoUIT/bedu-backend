import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Exam } from './exam.entity';
import { Question } from './question.entity';

@Entity({ name: 'answer' })
export class Answer extends AbstractEntity<Answer> {

  @Column()
  isCorrect: boolean;

  @Column()
  points: number;

  @ManyToOne(
    () => User, 
    (user) => user.answer,
    { eager: true }
  )
  user: User;

  @ManyToOne(
    () => Exam, 
    (exam) => exam.answer,
    { eager: true }
  )
  exam: Exam;

  @ManyToOne(
    () => Question, 
    (question) => question.studentAnswer,
    { eager: true }
  )
  question: Question;

  @ManyToOne(() => Question, (question) => question.question)
  correctAnswer: Question;
} 
