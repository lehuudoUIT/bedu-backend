import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

@Entity('comments')
export class Comment extends AbstractEntity<Comment> {
  @Column({ type: 'text' })
  content: string;

  @Column()
  left: number;

  @Column()
  right: number;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
  parent: Comment;  

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];  

  @ManyToOne(()  => User, (user) => user.comment)
  user: User;

  @ManyToOne(
    () => Lesson, 
    (lesson) => lesson.comment,
    { eager: true } 
  )
  lesson: Lesson;
} 
