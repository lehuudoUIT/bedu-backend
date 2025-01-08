import { UserProgram } from 'src/entities/user_program.entity';
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
import { UserClassService } from '../user_class/user_class.service';
import { UserClass } from 'src/entities/user_class.entity';
import { User } from 'src/entities/user.entity';
import { UserProgramService } from '../user_program/user_program.service';
import { AnswerService } from '../answer/answer.service';
import { Exam } from 'src/entities/exam.entity';
import { ReScheduleLessonDto } from './dtos/re-schedule-lesson.dto';

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
    private readonly userClassService: UserClassService,
    private readonly UserProgramService: UserProgramService,
    private readonly answerService: AnswerService,
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
      // .andWhere('lesson.isActive = :isActive', { isActive: status })
      .orderBy('lesson.id', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const totalRecord = await this.lessonRepository
      .createQueryBuilder('lesson')
      .where('lesson.deletedAt is NULL')
      // .andWhere('lesson.isActive = :isActive', { isActive: status })
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

    let exam: Exam = lesson.exam;
    console.log(updateLessonDto.examId);
    if (updateLessonDto.examId === null) {
      console.log('Yeah');
      exam = null;
    } else if (
      typeof updateLessonDto.examId !== 'undefined' &&
      typeof updateLessonDto.examId === 'number'
    ) {
      exam = await this.examService.findOne(updateLessonDto.examId);
      console.log(exam);
      if (!exam) {
        throw new NotFoundException('Exam information is not found');
      }
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

  async getScoreTableOfClassOrCourseInExam(classId: number, courseId: number) {
    if (typeof classId !== 'undefined' && typeof courseId !== 'undefined') {
      throw new BadRequestException(
        "Can't get score table of class and course at the same time",
      );
    }
    let listStudent: User[] = [];
    if (typeof classId !== 'undefined') {
      listStudent =
        await this.userClassService.findAllByClassNotPaginate(classId);
    }
    if (typeof courseId !== 'undefined') {
      listStudent =
        await this.UserProgramService.findAllByProgramIdNotPaginate(courseId);
    }
  }

  async findCourseClassByExamId(examId: number) {
    const lesson = await this.lessonRepository
      .createQueryBuilder('lesson')
      .leftJoinAndSelect('lesson.exam', 'exam')
      .leftJoinAndSelect('lesson.class', 'class')
      .leftJoinAndSelect('lesson.course', 'course')
      .where('lesson.deletedAt IS NULL')
      .andWhere('exam.id = :examId', { examId })
      .getOne();

    let listStudent: User[] = [];
    if (lesson.class !== null) {
      listStudent = await this.userClassService.findAllByClassNotPaginate(
        lesson.class.id,
      );
      // console.log("listStudent", listStudent)
    }

    if (lesson.course !== null) {
      listStudent = await this.UserProgramService.findAllByProgramIdNotPaginate(
        lesson.course.id,
      );
    }

    return listStudent;
  }

  async deleteLessonOfClass(classId: number, lessonId: number) {
    try {
      const classData = await this.classService.findOne(classId);
      const lesson = await this.lessonRepository.findOneBy({ id: lessonId });

      await this.googleService.deleteEvent(
        classData.calendarId,
        lesson.calendarEventId,
      );

      const result = await this.lessonRepository.update(
        { id: lessonId },
        { isActive: false },
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async rescheduleLessonOfClass(reScheduleLessonDto: ReScheduleLessonDto) {
    try {
      const { classId, lessonId, startDate, endDate } = reScheduleLessonDto;
      const classData = await this.classService.findOne(classId);
      const lesson = await this.lessonRepository.findOneBy({ id: lessonId });
      //* Delete google event
      await this.googleService.deleteEvent(
        classData.calendarId,
        lesson.calendarEventId,
      );
      const attendees =
        await this.userClassService.getListEmailOfClass(classId);

      //* Modify old lesson's status to be inactive
      await this.lessonRepository.update({ id: lessonId }, { isActive: false });
      //* Add new google event
      const eventId = await this.googleService.addEventToCalendar({
        calendarId: classData.calendarId,
        summary: classData.code,
        startDate,
        endDate,
        attendees,
      });

      //* Insert new lesson
      const result = await this.lessonRepository.insert({
        startDate,
        endDate,
        title: `Makeup Lesson ${lesson.title}`,
        type: 'live',
        calendarEventId: eventId,
        teacher: lesson.teacher,
        document: lesson.document,
        class: lesson.class,
        exam: lesson.exam,
      });

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
