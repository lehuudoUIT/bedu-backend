import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { UserProgram } from './user_program.entity';
import { Course } from './course.entity';
import { Payment } from './payment.entity';

@Entity({ name: 'programs' })
export class Program extends AbstractEntity<Program> {
  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  sessionQuantity: number;

  // type  is in toeic, ielts, toefl
  @Column()
  type: string;

  @Column({ type: 'boolean', default: true}) 
  isActive: boolean;

  @OneToMany(() => UserProgram, (userProgram) => userProgram.program)
  userProgram: UserProgram[];

  @ManyToMany(
    () => Course, 
    (course) => course.program, 
    {eager: true} 
  )
  @JoinTable({
    name: "programs_courses",
  })
  course: Course[];

  @OneToMany(() => Payment, (payment) => payment.program)
  payment: Payment[];
}
