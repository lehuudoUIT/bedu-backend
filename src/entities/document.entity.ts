import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

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

  @Column()
  isPublic: boolean;
}
