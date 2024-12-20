import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from '../../entities/class.entity';
import { Repository } from 'typeorm';
import { GoogleService } from '../google/google.service';
@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    private readonly googleService: GoogleService,
  ) {}

  extractNumber(str: string): number {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async findMaxCode(): Promise<number> {
    const classItem = await this.classRepository
      .createQueryBuilder('class')
      .orderBy('class.code', 'DESC')
      .getOne();
    if (!classItem) {
      return 0;
    }
    return this.extractNumber(classItem.code);
  }

  async create(createClassDto: CreateClassDto): Promise<Class> {
    try {
      const code = `CLS${(await this.findMaxCode()) + 1}`;

      const calendar = await this.googleService.createCalendar(
        code,
        createClassDto.description,
      );

      const classEntity = this.classRepository.create({
        ...createClassDto,
        code,
        calendarId: calendar.id,
      });
      const result = await this.classRepository.save(classEntity);

      if (!result) {
        throw new InternalServerErrorException(
          'Failed to create class information',
        );
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    totalRecord: number;
    answers: Class[];
  }> {
    try {
      const classes = await this.classRepository
        .createQueryBuilder('class')
        .leftJoinAndSelect('class.program', 'program')
        .leftJoinAndSelect('class.lesson', 'lesson')
        .where('class.isActive = true')
        .andWhere('class.deletedAt is null')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
      const totalRecord = await this.classRepository
        .createQueryBuilder('class')
        .where('class.isActive = true')
        .andWhere('class.deletedAt is null')
        .getCount();
      return {
        totalRecord: totalRecord,
        answers: classes,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllByType(
    page: number = 1,
    limit: number = 10,
    type: string = 'toeic',
  ): Promise<{
    totalRecord: number;
    answers: Class[];
  }> {
    const classes = await this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.program', 'program')
      .leftJoinAndSelect('class.lesson', 'lesson')
      .where('class.type = :type', { type })
      .andWhere('class.isActive = true')
      .andWhere('class.deletedAt is null')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const totalRecord = await this.classRepository
      .createQueryBuilder('class')
      .where('class.type = :type', { type })
      .andWhere('class.isActive = true')
      .andWhere('class.deletedAt is null')
      .getCount();
    if (classes.length === 0) {
      throw new NotFoundException('Class information is not found');
    }
    return {
      totalRecord: totalRecord,
      answers: classes,
    };
  }

  async findOne(id: number): Promise<Class> {
    const classItem = await this.classRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.lesson', 'lesson')
      .where('class.id = :id', { id })
      .andWhere('class.isActive = true')
      .andWhere('class.deletedAt is null')
      .getOne();
    if (!classItem) {
      throw new NotFoundException('Class is not found');
    }
    return classItem;
  }

  async update(id: number, updateAnswerDto: UpdateClassDto) {
    const classItem = await this.findOne(id);
    if (!classItem) {
      throw new NotFoundException('Class information is not found');
    }

    const newClass = this.classRepository.create({
      ...classItem,
      ...updateAnswerDto,
    });
    const result = await this.classRepository.save(newClass);
    if (!result) {
      throw new InternalServerErrorException(
        'Failed to update class information',
      );
    }
    return result;
  }

  async remove(id: number) {
    const classItem = await this.findOne(id);
    if (!classItem) {
      throw new NotFoundException('Class information is not found');
    }
    classItem.isActive = false;
    classItem.deletedAt = new Date();
    const result = await this.classRepository.save(classItem);
    if (!result) {
      throw new InternalServerErrorException(
        'Failed to delete class information',
      );
    }
    return result;
  }
}
