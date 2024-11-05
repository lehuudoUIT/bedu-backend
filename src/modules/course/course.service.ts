import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(createClassDto: CreateCourseDto) {
    return await this.courseRepository.insert(createClassDto);
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOne(id: number) {
    return await this.courseRepository.findOneBy({ id });
  }

  async update(id: number, updateAnswerDto: UpdateCourseDto) {
    return await this.courseRepository.update({ id }, updateAnswerDto);
  }

  async remove(id: number) {
    return await this.courseRepository.delete({ id });
  }
}
