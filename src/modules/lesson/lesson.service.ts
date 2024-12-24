import { UsersService } from './../users/users.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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

    if (!classData.calendarId)
      throw new NotFoundException('CalendarId not found!');

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
          title: createRecurringLessonDto.summary,
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

  async getRecordOfLesson(lessonId: number, classId: number) {
    try {
      const lessonData = await this.lessonRepository.findOneBy({
        id: lessonId,
      });
      if (!lessonData) throw new NotFoundException('Bài học không tồn tại!');

      if (lessonData.videoUrl) return lessonData.videoUrl;

      const classData = await this.classService.findOne(classId);
      if (!classData) throw new NotFoundException('Lớp học không tồn tại!');

      const event = await this.googleService.getEventDetails(
        classData.calendarId,
        lessonData.calendarEventId,
      );
      if (!event.attachments[0]?.fileId)
        throw new NotFoundException('Record chưa hoàn thành tải lên!');
      const fileId = event.attachments[0]?.fileId;
      const publicLink = await this.googleService.setFilePublic(fileId);

      //! update lesson record
      await this.lessonRepository.update(
        { id: lessonId },
        { videoUrl: publicLink },
      );
      return publicLink;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status: string,
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
      .andWhere('lesson.isActive = :isActive', { isActive: status })
      .orderBy('lesson.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const totalRecord = await this.lessonRepository
      .createQueryBuilder('lesson')
      .where('lesson.deletedAt is NULL')
      .andWhere('lesson.isActive = :isActive', { isActive: status })
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
      .andWhere('lesson.deletedAt is NULL')
      .getOne();

    if (!lesson) {
      throw new NotFoundException('Lesson information not found');
    }
    return lesson;
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    // Tìm lesson hiện có
    const lesson = await this.findOne(id);
    if (!lesson) {
      throw new NotFoundException('Lesson information is not found');
    }

    // Xác thực teacher nếu `teacherId` được cung cấp
    const teacher = updateLessonDto.teacherId
      ? await this.usersService.findUserById(updateLessonDto.teacherId)
      : lesson.teacher; // Giữ nguyên teacher hiện tại nếu không cung cấp
    if (updateLessonDto.teacherId && !teacher) {
      throw new NotFoundException('Teacher information is not found');
    }

    // Xác thực class nếu `classId` được cung cấp
    const classData = updateLessonDto.classId
      ? await this.classService.findOne(updateLessonDto.classId)
      : lesson.class; // Giữ nguyên class hiện tại nếu không cung cấp
    if (updateLessonDto.classId && !classData) {
      throw new NotFoundException('Class information is not found');
    }

    // Xác thực course nếu `courseId` được cung cấp
    const course = updateLessonDto.courseId
      ? await this.courseService.findOne(updateLessonDto.courseId)
      : lesson.course; // Giữ nguyên course hiện tại nếu không cung cấp
    if (updateLessonDto.courseId && !course) {
      throw new NotFoundException('Course information is not found');
    }

    // Xác thực exam nếu `examId` được cung cấp
    const exam = updateLessonDto.examId
      ? await this.examService.findOne(updateLessonDto.examId)
      : lesson.exam; // Giữ nguyên exam hiện tại nếu không cung cấp
    if (updateLessonDto.examId && !exam) {
      throw new NotFoundException('Exam information is not found');
    }

    // Tạo đối tượng lesson mới với dữ liệu cập nhật
    const newLesson = this.lessonRepository.create({
      ...lesson,
      ...updateLessonDto,
      teacher,
      class: classData,
      course,
      exam,
    });

    // Lưu lesson đã cập nhật
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
