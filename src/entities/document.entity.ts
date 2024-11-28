import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { LessonDocument } from './lesson_document.entity';
import { Question } from './question.entity';

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

  @OneToMany(
    () => LessonDocument, 
    (lessonDocument) => lessonDocument.document)
  lessonDocument: LessonDocument[];

  @ManyToMany(
    () => Question,  
    (question) => question.document,
    { eager: true })
  @JoinTable({name: "documents_questions"})
  question: Question[];
}
