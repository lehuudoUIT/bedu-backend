import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

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
  price: number;

  @Column()
  isPublic: boolean;
}
