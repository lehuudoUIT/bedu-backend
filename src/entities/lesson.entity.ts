import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'lessons' })
export class Lesson extends AbstractEntity<Lesson> {
  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column()
  type: string;

  @Column()
  videoUrl: string;

  // Many - to - One
  @Column()
  classId: number;

  // Many - to - One
  @Column()
  courseId: number;

  // Many - to - One
  @Column()
  examId: number;

  // Many - to - One
  @Column()
  teacherId: number;
}
