import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { LessonDocument } from './lesson_document.entity';
import { User } from './user.entity';
import { Class } from './class.entity';
import { Course } from './course.entity';
import {Comment} from './comment.entity';
import { Attendance } from './attendence.entity';
import { Exam } from './exam.entity';

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

  @OneToMany(() => LessonDocument, (lessonDocument) => lessonDocument.lesson)
  lessonDocument: LessonDocument[];

  @ManyToOne(
    () => User, 
    (teacher) => teacher.lesson,
    { eager: true }
  )
  teacher: User;

  @ManyToOne(
    () => Class, 
    (class_) => class_.lesson,
    { eager: true }
  )
  class: Class;

  @OneToMany(
    () => Course, 
    (course) => course.lesson,
    { eager: true }
  )
  course: Course;

  @OneToMany(
    () => Comment,
    (comment) => comment.lesson
  ) 
  comment: Comment;

  @OneToMany(() => Attendance, (attendance) => attendance.lesson)
  attendance: Attendance[];

  @ManyToOne(
    () => Exam, 
    (exam) => exam.lesson,
    { eager: true }
  )
  exam: Exam;

} 
