import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToOne, Timestamp } from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'attendances' })
export class Attendance extends AbstractEntity<Attendance> {

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time: Date;


  @ManyToOne(
    () => User, 
    (user) => user.attendance,
    { eager: true }
  )
  user: User;

  @ManyToOne(
    () => Lesson, 
    (lesson) => lesson.attendance,
    { eager: true }
  )
  lesson: Lesson;
}
