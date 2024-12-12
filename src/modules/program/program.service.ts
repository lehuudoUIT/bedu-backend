import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProgramDto } from './dtos/create-program.dto';
import { UpdateProgramDto } from './dtos/update-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from '../../entities/program.entity';
import { CourseService } from '../course/course.service';
import { Course } from '../../entities/course.entity';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    private readonly courseService: CourseService,
  ) {}

  async create(
    createProgramDto: CreateProgramDto
  ): Promise<Program> {
    let course: Course[] = [];
    if (createProgramDto.courseId) {
    for(let i = 0; i < createProgramDto.courseId.length; i++) {
      const courseItem = await this.courseService.findOne(createProgramDto.courseId[i]);
      console.log("Course item: ", courseItem);
      if (!courseItem) {
        throw new NotFoundException('Course information is not found');
      }
      course[i] = courseItem;
    }
  }

    const newProgram = this.programRepository.create({
      ...createProgramDto,
      course: course
    });
    const result = await this.programRepository.save(newProgram);
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    type: string = 'toeic'
  ) {
    try {
      const programs = await this.programRepository
                              .createQueryBuilder('program')
                              .leftJoinAndSelect('program.course', 'course')
                              .where('program.type = :type', { type })
                              .andWhere('program.isActive = true')
                              .andWhere('program.deletedAt IS NULL')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
      if (programs.length === 0) {
        throw new NotFoundException('Program not found');
      }
      return programs;

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const program = await this.programRepository.findOneBy({
        id,
        isActive: true,
        deletedAt: null
      });

      if (!program) {
        throw new NotFoundException('Program not found');
      }

      console.log("Program", program);

      return program;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: number, 
    updateProgramDto: UpdateProgramDto
  ) {
    try {
      const program = await this.findOne(id);

      if (!program) {
        throw new NotFoundException('Program not found');
      }
      
      let course: Course[] = [];
      if (updateProgramDto.courseId) {
        for(let i = 0; i < updateProgramDto.courseId.length; i++) {
          const courseItem = await this.courseService.findOne(updateProgramDto.courseId[i]);
          if (courseItem) {
            throw new NotFoundException('Course information is not found')
          }
          course[i] = courseItem;
        }
      }

      const newProgram = this.programRepository.create({
        ...program,
        ...updateProgramDto,
        course
      })
      const updatedProgram = await this.programRepository
                                    .save(newProgram);
      
      return updatedProgram;

    } catch (error) {
      throw new InternalServerErrorException(error.message); 
    }
  }

  async remove(
    id: number
  ) {
    try {
      const program = await this.findOne(id);
      if (!program) {
        throw new NotFoundException('Program not found');
      }
      program.deletedAt = new Date();
      program.isActive = false;
      const result = await this.programRepository.save(program);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


}
