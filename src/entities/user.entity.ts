import { Payment } from './payment.entity';
import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserProgram } from './user_program.entity';
import { UserClass } from './user_class.entity';
import { Score } from './score.entity';
import { Attendance } from './attendence.entity';
import {Comment} from './comment.entity';
import { Lesson } from './lesson.entity';
import { Answer } from './answer.entity';
import { Notification } from './notification.entity';
import {Report} from './report.entity';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User extends AbstractEntity<User> {
  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  birthday: string;

  @Column()
  address: string;

  @Column({ unique: true })
  cid: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  currentLevel: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => UserProgram, (userProgram) => userProgram.user)
  UserProgram: UserProgram[];

  @OneToMany(() => UserClass, (userClass) => userClass.user)  
  userClass: UserClass[];

  @OneToMany(() => Score, (score) => score.user)
  score: Score[];

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendance: Attendance[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comment: Comment[];

  @OneToMany(() => Lesson, (lesson) => lesson.teacher)
  lesson: Lesson[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answer: Answer[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payment: Payment[];

  @OneToMany(() => Notification, (notification) => notification.receiver)
  notificationReceiver : Notification[];

  @OneToMany(() => Notification, (notification) => notification.sender)
  notificationSender: Notification[];

  @OneToMany(() => Report, (report) => report.user)
  report: Report[];

  @ManyToOne(() => Role, (role) => role.user)
  role: Role;
}
