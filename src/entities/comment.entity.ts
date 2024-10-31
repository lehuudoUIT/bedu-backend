import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('comments')
export class Comment extends AbstractEntity<Comment> {
  @Column({ type: 'text' })
  content: string;

  @Column()
  left: number;

  @Column()
  right: number;

  @Column()
  parentId: number;

  @Column()
  isDeleted: boolean;

  // Many To One
  @Column()
  lessonId: number;
  // Many To One
  @Column()
  userId: number;
}
