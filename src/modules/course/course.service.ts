import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { Repository } from 'typeorm';
import { Program } from 'src/entities/program.entity';
import { ProgramService } from '../program/program.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @Inject(forwardRef(() => ProgramService))
    private readonly programService: ProgramService
  ) {}

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
    const course = await this.courseRepository.create({
      ...createClassDto,
      program
    });
    const result = await this.courseRepository.save(course);
    if (!result) {
      throw new NotFoundException('Failed to delete course');
    }
    return result
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<Course[]> {
    const course = await this.courseRepository
                              .createQueryBuilder('course')
                              .where('course.deletedAt IS NULL')
                              .where('course.isActive = :isActive', { isActive: true })
                              .orderBy('course.id', 'DESC')
                              .skip((page - 1) * limit)
                              .take(limit)
                                .getMany();
    if (course.length === 0) {
      throw new NotFoundException('No course found!');
    }
    return course;
  }

  async findAllByType(
    type: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<Course[]> {
    const course = await this.courseRepository
                              .createQueryBuilder('course')
                              .where('course.deletedAt IS NULL')
                              .andWhere('course.isActive = :isActive', { isActive: true })
                              .andWhere('course.courseType = :type', { type })
                              .orderBy('course.id', 'DESC')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
    if (course.length === 0) {
      throw new NotFoundException('No course found!');
    }
    return course
  }

  async findOne(
    id: number
  ): Promise<Course> {
    const course = await this.courseRepository 
                                .createQueryBuilder('course')
                                .leftJoinAndSelect('course.program', 'program')
                                .where('course.id = :id', { id })
                                .andWhere('course.deletedAt IS NULL')
                                .andWhere('course.isActive = :isActive', { isActive: true })
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
