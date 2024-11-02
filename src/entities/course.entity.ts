import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

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

  @Column()
  isPublic: boolean;
}
