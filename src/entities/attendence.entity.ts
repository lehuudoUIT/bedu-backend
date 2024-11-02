import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'attendances' })
export class Attendance extends AbstractEntity<Attendance> {
  // Many to one
  @Column()
  usedId: number;

  // Many to one
  @Column()
  lessonId: number;
}
