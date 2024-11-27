import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from 'src/entities/lesson.entity';
import { Repository } from 'typeorm';
import { ClassService } from '../class/class.service';
import { CourseService } from '../course/course.service';
import { ExamService } from '../exam/exam.service';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    private readonly usersService: UsersService,
    private readonly classService: ClassService,
    private readonly courseService: CourseService,
    private readonly examService: ExamService,
  ) {}

  async create(
    createLessonDto: CreateLessonDto
  ): Promise<ResponseDto> {
    try {
      const teacherResponse = await this.usersService.findUserById(createLessonDto.teacherId);
      if (teacherResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Failed to create lesson information because teacher is not found",
          data: null
        }
      }
      const teacher = Array.isArray(teacherResponse.data)
                    ? teacherResponse.data[0]
                    : teacherResponse.data;
      const  classResponse = await this.classService.findOne(createLessonDto.classId);
      const classData = Array.isArray(classResponse.data)
                    ? classResponse.data[0]
                    : classResponse.data;
      const courseResponse = await this.courseService.findOne(createLessonDto.courseId);
      const course = Array.isArray(courseResponse.data)
                    ? courseResponse.data[0]
                    : courseResponse.data;
      const examResponse = await this.examService.findOne(createLessonDto.examId);
      const exam = Array.isArray(examResponse.data)
                    ? examResponse.data[0]
                    : examResponse.data;
      if (examResponse.statusCode !== 200 && courseResponse.statusCode !== 200 && classResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Failed to create lesson information because class, course or exam is not found",
          data: null
        }
      }
      
      const newLesson = this.lessonRepository.create({
        ...createLessonDto,
        teacher,
        class: classData,
        course,
        exam
      })
      const result = await this.lessonRepository.save(newLesson);
      return {
        statusCode: 200,
        message: "Lesson information has been successfully created",
        data: result,
      }
      
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const  lessons = await this.lessonRepository
                                  .createQueryBuilder('lesson')
                                  .leftJoinAndSelect('lesson.teacher', 'teacher')
                                  .leftJoinAndSelect('lesson.class', 'class')
                                  .leftJoinAndSelect('lesson.course', 'course')
                                  .leftJoinAndSelect('lesson.exam', 'exam')
                                  .where('lesson.deletedAt = :isDeleted', { isDeleted: false })
                                  .orderBy('lesson.id', 'DESC')
                                  .skip((page - 1) * limit)
                                  .take(limit)
                                  .getMany();
      if(lessons.length === 0) {
        return {
          statusCode: 404,
          message: "No lesson information found",
          data: null,
        }
      }
      return {
        statusCode: 200,
        message: "Retrieve lesson information successfully",
        data: lessons,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  async findOne(
    id: number
  ) {
    const lesson = await this.lessonRepository
                              .createQueryBuilder('lesson')
                              .leftJoinAndSelect('lesson.teacher', 'teacher')
                              .leftJoinAndSelect('lesson.class', 'class')
                              .leftJoinAndSelect('lesson.course', 'course')
                              .leftJoinAndSelect('lesson.exam', 'exam')
                              .where('lesson.id = :id', { id })
                              .andWhere('lesson.isActive = :isActive', { isActive: true})
                              .andWhere('lesson.deletedAt is NULL')
                              .getOne();
    if (!lesson) {
      return {
        statusCode: 404,
        message: "Lesson information not found",
        data: null,
      }
    }
    return {
      statusCode: 200,
      message: "Retrieve lesson information successfully",
      data: lesson,
    }
  }

  async update(
    id: number, 
    updateLessonDto: UpdateLessonDto
  ): Promise<ResponseDto> {
    try {
      const lessonResponse = await this.findOne(id);
      if (lessonResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Failed to update lesson information because lesson is not found",
          data: null
        }
      }
      const lesson = Array.isArray(lessonResponse.data)
                    ? lessonResponse.data[0]
                    : lessonResponse.data;
      const teacherResponse = await this.usersService.findUserById(updateLessonDto.teacherId);
      if (teacherResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Failed to update lesson information because teacher is not found",
          data: null
        }
      }
      const teacher = Array.isArray(teacherResponse.data)
                    ? teacherResponse.data[0]
                    : teacherResponse.data;
      const  classResponse = await this.classService.findOne(updateLessonDto.classId);
      const classData = Array.isArray(classResponse.data)
                    ? classResponse.data[0]
                    : classResponse.data;
      const courseResponse = await this.courseService.findOne(updateLessonDto.courseId);
      const course = Array.isArray(courseResponse.data)
                    ? courseResponse.data[0]
                    : courseResponse.data;
      const examResponse = await this.examService.findOne(updateLessonDto.examId);
      const exam = Array.isArray(examResponse.data)
                    ? examResponse.data[0]
                    : examResponse.data;
      if (examResponse.statusCode !== 200 && courseResponse.statusCode !== 200 && classResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Failed to update lesson information because class, course or exam is not found",
          data: null
        }
      }
      const newLesson = this.lessonRepository.create({
        ...lesson,
        ...updateLessonDto,
        teacher,
        class: classData,
        course,
        exam
      });
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  } 

  async remove(id: number): Promise<ResponseDto> {
    try {
      const lessonResponse = await this.findOne(id);
      if (lessonResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Failed to remove lesson information because lesson is not found",
          data: null
        }
      }
      const lesson = Array.isArray(lessonResponse.data)
                    ? lessonResponse.data[0]
                    : lessonResponse.data;
      const newLesson = this.lessonRepository.create({
        ...lesson,
        deletedAt: new Date(),
        isActive: false,
      });

      const result = await this.lessonRepository.save(newLesson);
      return {
        statusCode: 200,
        message: "Lesson information has been successfully removed",
        data: result,
      }
    }catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }
}
