import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Exam } from './exam.entity';
import { Document } from './document.entity';
import { Answer } from './answer.entity';
import { QuestionStrategy } from 'src/modules/question/strategies/question-strategy.interface';

@Entity({ name: 'questions' })
export class Question extends AbstractEntity<Question> {

  @Column()
  question: string;

  // @Column() 
  // score: number;

  @Column('float')
  totalPoints: number;

  @Column()
  // format for correct answer is 0.75/0.25/0.5
  pointDivision: string; 

  // lList of possible answers to the question
  @Column()
  possibleAnswer: string;

  @Column()
  content: string;

  @Column()
  attach: string;

  // questionType is in 
  // MultipleChoice, SingleChoice, FillInTheBlankChoice
  @Column()
  questionType: string;

  @Column()
  // format for answer is "A/C/D/B"
  // If you do not answer any question, 
  // put the @ symbol in place of the answer.
  // Example: "A @/D/B"
  answer: string;

  @ManyToMany(
    () => Exam, 
    (exam) => exam.questions,
    { eager: true })
  exam: Exam[];

  @ManyToMany(
    () => Document,
    (document) => document.question)
  document: Document[];

  @OneToMany(() => Answer, (answer) => answer.question)
  studentAnswer: Answer[];

  // @OneToMany(() => Answer, (answer) => answer.question)
  // correctAnswer: Answer[];
  
}
