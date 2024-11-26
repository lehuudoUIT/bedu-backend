import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { Repository } from 'typeorm';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(
    createClassDto: CreateCourseDto
  ): Promise<ResponseDto> {
    try {
      const course = await this.courseRepository.create(createClassDto);
      const result = await this.courseRepository.save(course);
      return {
        statusCode: 201,
        message: "Course created successfully",
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Failed to create course",
        data: null
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ) {
    const course = await this.courseRepository
                              .createQueryBuilder('course')
                              .where('course.deletedAt IS NULL')
                              .where('course.isActive = :isActive', { isActive: true })
                              .orderBy('course.id', 'DESC')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
    if (course.length === 0) {
      return {
        statusCode: 404,
        message: "Courses not found",
        data: null
      }
    }
    return {
      statusCode: 200,
      message: "Retrieve courses information successfully",
      data: course
    }
  }

  async findAllByType(
    type: string = "",
    page: number = 1,
    limit: number = 10,
  ) {
    const course = await this.courseRepository
                              .createQueryBuilder('course')
                              .where('course.deletedAt IS NULL')
                              .andWhere('course.isActive = :isActive', { isActive: true })
                              .andWhere('course.type = :type', { type })
                              .orderBy('course.id', 'DESC')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
    if (course.length === 0) {
      return {
        statusCode: 404,
        message: "Courses not found",
        data: null
      }
    }
    return {
      statusCode: 200,
      message: "Retrieve courses information successfully",
      data: course
    }
  }

  async findOne(
    id: number
  ): Promise<ResponseDto> {
    try {
      const course = await this.courseRepository.findOneBy({
        id,
        deletedAt: null, 
        isActive: true
      })
      if (!course) {
        return {
          statusCode: 404,
          message: "Course information not found",
          data: null
        }
      }
      return {
        statusCode: 200,
        message: "Retrieve course information successfully",
        data: course
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Failed to retrieve course information",
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateAnswerDto: UpdateCourseDto
  ): Promise<ResponseDto> {
    try {
      const courseResponse = await this.findOne(id);
      if (courseResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Course not found",
          data: null
        }
      }
      const course = Array.isArray(courseResponse.data) 
                      ? courseResponse.data[0] 
                      : courseResponse.data;

      const newCourse =  this.courseRepository.create({
        ...course,
        ...updateAnswerDto
      })

      const result = await this.courseRepository.save(newCourse);

      return {
        statusCode: 200,
        message: "Course updated successfully",
        data: result
      }
    } catch(error) { 
      return {
        statusCode: 500,
        message: "Failed to update course",
        data: null
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const courseResponse = await this.findOne(id);
      if (courseResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Course not found",
          data: null
        }
      }
      const course = Array.isArray(courseResponse.data) 
                      ? courseResponse.data[0] 
                      : courseResponse.data;

      const newCourse =  this.courseRepository.create({
        ...course,
        deletedAt: new Date(),
        isActive: false
      })

      const result = await this.courseRepository.save(newCourse);

      return {
        statusCode: 200,
        message: "Course deleted successfully",
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Failed to delete course",
        data: null
      }
    }
  }
}
