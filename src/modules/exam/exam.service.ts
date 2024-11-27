import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dtos/create-exam.dto';
import { UpdateExamDto } from './dtos/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Exam } from 'src/entities/exam.entity';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(
    createExamDto: CreateExamDto
  ): Promise<ResponseDto> {
    try {
      const exam = this.examRepository.create(createExamDto);
      const result = await this.examRepository.save(exam);
      return {
        statusCode: 201,
        message: 'Exam created successfully',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  async findAll(
    page: number,
    limit: number,
  ) {
    try {
      const exams = await this.examRepository
                          .createQueryBuilder('exam')
                          .where('exam.deletedAt IS NULL')
                          .andWhere('exam.isActive = :isActive', { isActive: true })
                          .orderBy('exam.id', 'ASC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
      if (exams.length === 0) {
        return {
          statusCode: 404,
          message: 'No exam found',
          data: null,
        }
      }

      return {
        statusCode: 200,
        message: 'Exams retrieved successfully',
        data: exams,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  async findAllByType(
    page: number,
    limit: number,
    type: string,
  ): Promise<ResponseDto> {
    try {
      const exams = await this.examRepository
                          .createQueryBuilder('exam')
                          .where('exam.deletedAt IS NULL')
                          .andWhere('exam.isActive = :isActive', { isActive: true })
                          .andWhere('exam.type = :type', { type })
                          .orderBy('exam.id', 'ASC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
      if (exams.length === 0) {
        return {
          statusCode: 404,
          message: 'No exam found',
          data: null,
        }
      }

      return {
        statusCode: 200,
        message: 'Exams retrieved successfully',
        data: exams,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const exam = await this.examRepository
                              .findOneBy({ 
                                id,
                                isActive: true,
                                deletedAt: IsNull(),
                              });
      if (!exam) {
        return {
          statusCode: 404,
          message: 'Exam not found',
          data: null,
        }
      }

      return {
        statusCode: 200,
        message: 'Exam retrieved successfully',
        data: exam,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  async update(
    id: number, 
    updateExamDto: UpdateExamDto
  ): Promise<ResponseDto> {
    try {
      const newExam = this.examRepository.create(updateExamDto);
      const result = await this.examRepository.save(newExam);
      return {
        statusCode: 200,
        message: 'Exam updated successfully',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const examResponse = await this.findOne(id);
      if (!examResponse) {
        return {
          statusCode: 404,
          message: 'Exam not found',
          data: null,
        }
      }

      const exam = Array.isArray(examResponse.data) 
                        ? examResponse.data[0] 
                        : examResponse.data;

      exam.isActive = false;
      exam.deletedAt = new Date();
      const result = await this.examRepository.save(exam);
      return {
        statusCode: 200,
        message: 'Exam deleted successfully',
        data: result,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null,
      }
    }
  }
}
