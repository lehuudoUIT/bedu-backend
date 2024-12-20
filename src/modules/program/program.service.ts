import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

  extractNumber(str: string): number {
    const match = str.match(/\d+/); 
    return match ? parseInt(match[0], 10) : 0;
  }

  async findMaxCode(): Promise<number> {
    const programItem = await this.programRepository
                            .createQueryBuilder('program')
                            .orderBy('program.code', 'DESC')
                            .getOne();
    if (!programItem) {
      return 0;
    }
    return this.extractNumber(programItem.code);
  }

  async create(
    createProgramDto: CreateProgramDto
  ): Promise<Program> {
    const maxCode = await this.findMaxCode();
    let cid=null;
    if (createProgramDto.type == 'toeic') {
      cid = `PT${maxCode + 1}`;
    } else if (createProgramDto.type == 'ielts') {
      cid = `PI${maxCode + 1}`;
    } else if (createProgramDto.type == 'toefl') {
      cid = `PF${maxCode + 1}`;
    } else {
      throw new NotFoundException('Type is not found');
    }
    let course: Course[] = [];
    let totalPrice: number = 0;
    if (createProgramDto.courseId) {
    for(let i = 0; i < createProgramDto.courseId.length; i++) {
      const courseItem = await this.courseService.findOne(createProgramDto.courseId[i]);
      console.log("Course item: ", courseItem);
      if (!courseItem) {
        throw new NotFoundException('Course information is not found');
      }
      totalPrice += courseItem.price;
      course[i] = courseItem;
    }
  }

    const newProgram = this.programRepository.create({
      ...createProgramDto,
      course: course,
      code: cid,
      price: totalPrice
    });
    const result = await this.programRepository.save(newProgram);
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    totalRecord: number,
    programs: Program[]
  }> {
    try {
      const programs = await this.programRepository
                              .createQueryBuilder('program')
                              .leftJoinAndSelect('program.course', 'course')
                             // .where('program.isActive = :isActive', { isActive: status})
                              .andWhere('program.deletedAt IS NULL')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
      const total = await this.programRepository
                              .createQueryBuilder('program')
                              //.where('program.isActive = :isActive', { isActive: status})
                              .andWhere('program.deletedAt IS NULL')
                              .getCount();
      return {
        totalRecord: total,
        programs: programs
      }
    } catch(error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllByType(
    page: number = 1,
    limit: number = 10,
    type: string = 'toeic'
  ): Promise<{
    totalRecord: number,
    programs: Program[]
  }> {
    try {
      const programs = await this.programRepository
                              .createQueryBuilder('program')
                              .leftJoinAndSelect('program.course', 'course')
                              .where('program.type = :type', { type })
                             // .andWhere('program.isActive = :isActive', { isActive: status })
                              .andWhere('program.deletedAt IS NULL')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
      const total = await this.programRepository
                              .createQueryBuilder('program')
                              .where('program.type = :type', { type })
                              //.andWhere('program.isActive = :isActive', { isActive: status })
                              .andWhere('program.deletedAt IS NULL')
                              .getCount();
      if (programs.length === 0) {
        throw new NotFoundException('Program not found');
      }
      return {
        totalRecord: total,
        programs: programs
      };

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const program = await this.programRepository.findOneBy({
        id,
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
      let programPrice: number = 0;
      let course: Course[] = [];
      if (updateProgramDto.courseId) {
        for(let i = 0; i < updateProgramDto.courseId.length; i++) {
          const courseItem = await this.courseService.findOne(updateProgramDto.courseId[i]);
          if (!courseItem) {
            throw new NotFoundException('Course information is not found')
          }
          programPrice += courseItem.price;
          course[i] = courseItem;
        }
      }

      const newProgram = this.programRepository.create({
        ...program,
        ...updateProgramDto,
        course,
        price: programPrice
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

  async addCourseToProgram(
    idProgram: number,
    idCourse: number,
  ): Promise<{
    course: Course,
    program: Program
  }> {
    try {
      const course = await this.courseService.findOne(idCourse);
      if (!course) { 
        throw new NotFoundException('Course not found');
      }
      const program = await this.findOne(idProgram);
      if (!program) {
        throw new NotFoundException('Program not found');
      }
      const compare =  program.course.some((existingCourse) => {
        existingCourse.id === course.id
      })
      console.log("Compare", compare);
      for (let i = 0; i < program.course.length; i++) {
        if (program.course[i].id === course.id) {
          throw new BadRequestException('Course already exists in the program');
        }
      }
      console.log("Save program");
      program.course.push(course);
      const result = await this.programRepository.save(program);

      return {
        course,
        program: result
      }

    } catch(error) {
      return {
        course: null,
        program: null
      } 
    }
  }
}
