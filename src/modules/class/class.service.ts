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

  async create(createClassDto: CreateClassDto): Promise<Class> {
    try {
      const calendar = await this.googleService.createCalendar(
        createClassDto.code,
        createClassDto.description,
      );

      const classEntity = this.classRepository.create({
        ...createClassDto,
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
    type: string = 'toeic',
  ): Promise<{
    totalRecord: number;
    answers: Class[];
  }> {
    const classes = await this.classRepository
      .createQueryBuilder('class')
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

  async findOne(id: number) {
    const classEntity = await this.classRepository.findOneBy({
      id,
      isActive: true,
      deletedAt: null,
    });
    if (!classEntity) {
      throw new NotFoundException('Class is not found');
    }
    return classEntity;
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
