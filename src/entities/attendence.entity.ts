import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'attendances' })
export class Attendance extends AbstractEntity<Attendance> {

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
