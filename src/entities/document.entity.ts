import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { LessonDocument } from './lesson_document.entity';
import { Question } from './question.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'documents' })
export class Document extends AbstractEntity<Document> {
  @Column()
  code: string;

  @Column()
  documentType: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  attachFile: string;

  // @OneToMany(
  //   () => LessonDocument, 
  //   (lessonDocument) => lessonDocument.document)
  // lessonDocument: LessonDocument[];

  @ManyToOne(() => Lesson, (lesson) => lesson.document, { eager: true })
  lesson: Lesson;

  @ManyToMany(
    () => Question,  
    (question) => question.document,
    { eager: true })
  @JoinTable({name: "documents_questions"})
  question: Question[];
}
