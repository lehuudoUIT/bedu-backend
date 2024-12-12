import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserClass } from './user_class.entity';
import { Payment } from './payment.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'classes' })
export class Class extends AbstractEntity<Class> {
  @Column()
  code: string;

  @Column()
  name: string;

  @Column()
  studyForm: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column()
  description: string;

  @Column()
  lessonQuantity: number;

  @Column()
  timePerLesson: number;

  @Column()
  type: string;

  @Column()
  price: number; 

  @Column()
  target_start: number ;
  
  @Column()
  target_end: number; 

  @OneToMany(() => UserClass, (userClass) => userClass.class)
  class: Class[];

  @OneToMany(() => Payment, (payment) => payment.class)
  payment: Payment[];

  @OneToMany(() => Lesson, (lesson) => lesson.class)
  lesson: Lesson[];
}
