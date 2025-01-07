import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Exam } from './exam.entity';
import { Question } from './question.entity';
import { Class } from './class.entity';
import {Course} from './course.entity'

@Entity({ name: 'answer' })
export class Answer extends AbstractEntity<Answer> {

  // @Column()
  // isCorrect: boolean;

  @Column()
  points: number;

  @Column()
  content: string;

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

  // @ManyToOne(
  //   () => Question, 
  //   (question) => question.question)
  // correctAnswer: Question;

  @Column({default: 1})
  testAttempts: number;
} 
