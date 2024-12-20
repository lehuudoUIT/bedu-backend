import { UsersService } from './../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateLessonDto,
  CreateRecurringLessonDto,
} from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson, LessonType } from '../../entities/lesson.entity';
import { Repository } from 'typeorm';
import { ClassService } from '../class/class.service';
import { CourseService } from '../course/course.service';
import { ExamService } from '../exam/exam.service';
import { GoogleService } from '../google/google.service';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly usersService: UsersService,
    private readonly classService: ClassService,
    private readonly courseService: CourseService,
    private readonly examService: ExamService,
    private readonly googleService: GoogleService,
  ) {}

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    const teacher = await this.usersService.findUserById(
      createLessonDto.teacherId,
    );
    if (!teacher) {
      throw new NotFoundException('Teacher information is not found');
    }

    const newLesson = this.lessonRepository.create({
      ...createLessonDto,
      teacher,
    });

    let classData = null,
      course = null,
      exam = null;
    if (typeof createLessonDto.classId !== 'undefined') {
      classData = await this.classService.findOne(createLessonDto.classId);
      newLesson.class = classData;
    }
    console.log('Come here');
    if (typeof createLessonDto.courseId !== 'undefined') {
      course = await this.courseService.findOne(createLessonDto.courseId);
      newLesson.course = course;
    }
    if (typeof createLessonDto.examId !== 'undefined') {
      exam = await this.examService.findOne(createLessonDto.examId);
      newLesson.exam = exam;
    }
    if (!exam && !course && !classData) {
      throw new NotFoundException(
        'Class, course or exam information is not found',
      );
    }

    const result = await this.lessonRepository.save(newLesson);
    if (!result) {
      throw new NotFoundException('Failed to create lesson information');
    }
    return result;
  }

  async createRecurringLessonForClass(
    createRecurringLessonDto: CreateRecurringLessonDto,
  ): Promise<Lesson[]> {
    const teacher = await this.usersService.findUserById(
      createRecurringLessonDto.teacherId,
    );
    if (!teacher) {
      throw new NotFoundException('Teacher information is not found');
    }

    const classData = await this.classService.findOne(
      createRecurringLessonDto.classId,
    );

    const listEvents = await this.googleService
      .createRecurringEvent({
        calendarId: classData.calendarId,
        summary: createRecurringLessonDto.summary,
        description: createRecurringLessonDto.description,
        startDate: createRecurringLessonDto.startDate, // Ngày bắt đầu do người dùng chọn
        startTime: createRecurringLessonDto.startTime, // Giờ bắt đầu (HH:mm)
        endTime: createRecurringLessonDto.endTime, // Giờ kết thúc (HH:mm)
        selectedDays: createRecurringLessonDto.selectedDays, // ['Mon', 'Wed', 'Fri']
        lessonQuantity: createRecurringLessonDto.lessonQuantity, // Số buổi lặp lại
        attendees: [{ email: teacher.email }],
      })
      .then(async () => {
        return await this.googleService.listEvents(classData.calendarId);
      });

    const listLesson = await Promise.all(
      listEvents.map((event) => {
        const newLesson = this.lessonRepository.create({
          startDate: event.startTime,
          endDate: event.endTime,
          type: LessonType.LIVE,
          class: classData,
          calendarEventId: event.id,
          teacher,
        });
        const result = this.lessonRepository.save(newLesson);
        return result;
      }),
    );

    if (!listLesson) {
      throw new NotFoundException('Failed to create lesson information');
    }
    return listLesson;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    totalRecord: number;
    lessons: Lesson[];
  }> {
    const lessons = await this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .leftJoinAndSelect('lesson.class', 'class')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.exam', 'exam')
      .where('lesson.deletedAt is NULL')
      .andWhere('lesson.isActive = :isActive', { isActive: true })
      .orderBy('lesson.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const totalRecord = await this.lessonRepository
      .createQueryBuilder('lesson')
      .where('lesson.deletedAt is NULL')
      .andWhere('lesson.isActive = :isActive', { isActive: true })
      .getCount();
    if (lessons.length === 0) {
      throw new NotFoundException('No lesson found!');
    }
    return {
      totalRecord: totalRecord,
      lessons: lessons,
    };
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.teacher', 'teacher')
      .leftJoinAndSelect('lesson.class', 'class')
      .leftJoinAndSelect('lesson.course', 'course')
      .leftJoinAndSelect('lesson.exam', 'exam')
      .where('lesson.id = :id', { id })
      .andWhere('lesson.isActive = :isActive', { isActive: true })
      .andWhere('lesson.deletedAt is NULL')
      .getOne();
    if (!lesson) {
      throw new NotFoundException('Lesson information not found');
    }
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.findOne(id);
    if (!lesson) {
      throw new NotFoundException('Lesson information is not found');
    }

    const teacher = await this.usersService.findUserById(
      updateLessonDto.teacherId,
    );
    if (!teacher) {
      throw new NotFoundException('Teacher information is not found');
    }

    const classData = await this.classService.findOne(updateLessonDto.classId);

    const course = await this.courseService.findOne(updateLessonDto.courseId);
    const exam = await this.examService.findOne(updateLessonDto.examId);

    if (!exam && !course && !classData) {
      throw new NotFoundException(
        'Class, course or exam information is not found',
      );
    }
    const newLesson = this.lessonRepository.create({
      ...lesson,
      ...updateLessonDto,
      teacher,
      class: classData,
      course,
      exam,
    });
    const result = await this.lessonRepository.save(newLesson);
    if (!result) {
      throw new NotFoundException('Failed to update lesson information');
    }
    return result;
  }

  async remove(id: number): Promise<Lesson> {
    const lesson = await this.findOne(id);
    if (!lesson) {
      throw new NotFoundException('Lesson information is not found');
    }

    const newLesson = this.lessonRepository.create({
      ...lesson,
      deletedAt: new Date(),
      isActive: false,
    });

    const result = await this.lessonRepository.save(newLesson);
    if (!result) {
      throw new NotFoundException('Failed to delete lesson information');
    }
    return result;
  }
}
