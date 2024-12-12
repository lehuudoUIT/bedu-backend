import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Program } from './program.entity';
import { Lesson } from './lesson.entity';

@Entity({ name: 'courses' })
export class Course extends AbstractEntity<Course> {
  @Column()
  courseType: string;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  lessonQuantity: number;

  @Column()
  timePerLesson: number;

  @Column()
  price: number;

  @ManyToMany(
    () => Program, 
    (program) => program.course,
    {
      cascade: ['remove'] , 
      onDelete: 'CASCADE', 
    }
  )
  program: Program[];

  @OneToMany(() => Lesson, (lesson) => lesson.course)
  lesson: Lesson[];
}
