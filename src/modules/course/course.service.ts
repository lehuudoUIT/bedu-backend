import { forwardRef, Inject, Injectable, NotFoundException, Get } from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../../entities/course.entity';
import { Repository } from 'typeorm';
import { Program } from '../../entities/program.entity';
import { ProgramService } from '../program/program.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @Inject(forwardRef(() => ProgramService))
    private readonly programService: ProgramService
  ) {}

  // thiếu các phương thức lấy dữ liệu cho các student và teacher

  extractNumber(str: string): number {
    const match = str.match(/\d+/); 
    return match ? parseInt(match[0], 10) : 0;
  }

  async findMaxCode(): Promise<number> {
    const courseItem = await this.courseRepository
                            .createQueryBuilder('course')
                            .orderBy('course.code', 'DESC')
                            .getOne();
    if (!courseItem) {
      return 0;
    }
    return this.extractNumber(courseItem.code);
  }

  async create(
    createClassDto: CreateCourseDto
  ): Promise<Course> {
    let program: Program[] = [];
    if (createClassDto.programId) {
      for (let i = 0; i < createClassDto.programId.length; i++) {
        const program = await this.programService.findOne(createClassDto.programId[i]);
        if (!program) {
          throw new NotFoundException("Program is not found")
        }
        program[i] = program;
      }
    }

    const maxCode = await this.findMaxCode();
    const code = `CRS${maxCode + 1}`;

    const course = await this.courseRepository.create({
      ...createClassDto,
      program,
      code
    });
    const result = await this.courseRepository.save(course);
    if (!result) {
      throw new NotFoundException('Failed to delete course');
    }
    return result
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    totalRecord: number,
    courses: Course[]
  }> {
    const course = await this.courseRepository
                              .createQueryBuilder('course')
                              .leftJoinAndSelect('course.program', 'program')
                              .leftJoinAndSelect('course.lesson', 'lesson')
                              .where('course.deletedAt IS NULL')
                             // .andWhere('course.isActive = :isActive', { isActive: status })
                              .orderBy('course.id', 'DESC')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
    const totalRecord = await this.courseRepository
                              .createQueryBuilder('course')
                              .where('course.deletedAt IS NULL')
                             // .andWhere('course.isActive = :isActive', { isActive: status })
                              .getCount();

    if (course.length === 0) {
      throw new NotFoundException('No course found!');
    }
    return {
      totalRecord: totalRecord,
      courses: course
    };
  }

  async findAllByType(
    type: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    totalRecord: number,
    courses: Course[]
  }> {
    const courses = await this.courseRepository
                              .createQueryBuilder('course')
                              .leftJoinAndMapMany('course.program', 'course.program', 'program')
                              .leftJoinAndMapMany('course.lesson', 'course.lesson', 'lesson')
                              .where('course.deletedAt IS NULL')
                             // .andWhere('course.isActive = :isActive', { isActive: status })
                              .andWhere('course.courseType = :type', { type })
                              .orderBy('course.id', 'DESC')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
    const totalRecord = await this.courseRepository
                              .createQueryBuilder('course')
                              .where('course.deletedAt IS NULL')
                             // .andWhere('course.isActive = :isActive', { isActive: status })
                              .andWhere('course.courseType = :type', { type })
                              .getCount();
    if (courses.length === 0) {
      throw new NotFoundException('No course found!');
    }
    return {
      totalRecord: totalRecord,
      courses: courses
    }
  }

  async findOne(
    id: number
  ): Promise<Course> {
    const course = await this.courseRepository 
                                .createQueryBuilder('course')
                                .leftJoinAndSelect('course.program', 'program')
                                .leftJoinAndSelect('course.lesson', 'lesson')
                                .where('course.id = :id', { id })
                                .andWhere('course.deletedAt IS NULL')
                                .getOne();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async update(
    id: number, 
    updateCourseDto: UpdateCourseDto
  ): Promise<Course> {
    const course = await this.findOne(id);
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    
    let program: Program[] = [];
    if (updateCourseDto.programId) {
      for (let i = 0; i < updateCourseDto.programId.length; i++) {
        const programItem = await this.programService.findOne(updateCourseDto.programId[i]);
        if (!programItem) {
          throw new NotFoundException("Program is not found")
        }
        program[i] = programItem;
      }
    }

    let newCourse;

    newCourse =  this.courseRepository.create({
      ...course,
      ...updateCourseDto,
      program
    })

    const result = await this.courseRepository.save(newCourse);
    if (!result) {
      throw new NotFoundException('Failed to delete course');
    }

    return result;
  }

  async remove(id: number): Promise<Course> {
    const course = await this.findOne(id);
    if (!course) {
        throw new NotFoundException('Course not found');
    }

    const newCourse =  this.courseRepository.create({
      ...course,
      deletedAt: new Date(),
      isActive: false
    })
    const result = await this.courseRepository.save(newCourse);
    if (!result) {
      throw new NotFoundException('Failed to delete course');
    }
    return result;
  }

  
}
