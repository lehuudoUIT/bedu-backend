import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Exam } from './exam.entity';
import { Document } from './document.entity';
import { Answer } from './answer.entity';

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

  @OneToMany(() => Answer, (answer) => answer.question)
  correctAnswer: Answer[];
  
}
