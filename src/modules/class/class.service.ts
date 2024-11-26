import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/entities/class.entity';
import { Repository } from 'typeorm';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(
    createClassDto: CreateClassDto
  ): Promise<ResponseDto> {
    try {
      const classEntity = this.classRepository
                            .create(createClassDto);
      const result = await this.classRepository
                            .save(classEntity);
      return {
        statusCode: 201,
        message: 'Class created successfully',
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    type: string = 'toeic'
  ) {
    try {
      const classes = await this.classRepository
                                .createQueryBuilder('class')
                                .where('class.type = :type', { type })
                                .andWhere('class.isActive = true')
                                .andWhere('class.deletedAt is null')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany();
      if (!classes) {
        return {
          statusCode: 404,
          message: 'Class not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get all classes successfully',
        data: classes
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  } 

  async findOne(
    id: number
  ): Promise<ResponseDto> {
    try {
      const classEntity = await this.classRepository.findOneBy({
        id,
        isActive: true,
        deletedAt: null
      });
      if (!classEntity) {
        return {
          statusCode: 404,
          message: 'Class not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get class successfully',
        data: classEntity
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async update(
    id: number, updateAnswerDto: UpdateClassDto
  ): Promise<ResponseDto> {

    const classResponse = await this.findOne(id);
    if (classResponse.statusCode !== 200) {
      return {
        statusCode: 404,
        message: 'Class not found',
        data: null
      }
    }
    const classItem = Array.isArray(classResponse.data) 
                        ? classResponse.data[0] 
                        : classResponse.data;
      
    try {
      const newClass = this.classRepository.create({
        ...classItem,
        ...updateAnswerDto
      });
      const result = await this.classRepository.save(newClass);
      return {
        statusCode: 200,
        message: 'Class updated successfully',
        data: result
      }

    } catch (error) { 
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
    
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    const classResponse = await this.findOne(id);
    if (classResponse.statusCode !== 200) {
      return {
        statusCode: 404,
        message: 'Class not found',
        data: null
      }
    }
    const classItem = Array.isArray(classResponse.data) 
                        ? classResponse.data[0] 
                        : classResponse.data;
    try {
      classItem.isActive = false;
      classItem.deletedAt = new Date();

      const result = await this.classRepository.save(classItem);
      return {
        statusCode: 200,
        message: 'Class deleted successfully',
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
}
