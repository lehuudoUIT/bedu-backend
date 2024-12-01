import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dtos/create-exam.dto';
import { UpdateExamDto } from './dtos/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Exam } from 'src/entities/exam.entity';
import { ResponseDto } from './common/response.interface';
import { QuestionService } from '../question/question.service';
import { Question } from 'src/entities/question.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    private readonly questionService: QuestionService,
  ) {}

  async create(
    createExamDto: CreateExamDto
  ): Promise<ResponseDto> {
    try {
      let question:Question[] = [];
      if (createExamDto.questionId) {
        for(let i = 0; i < createExamDto.questionId.length; i++) {
          const questionResponse = await this.questionService.findOne(createExamDto.questionId[i]);
          if (questionResponse.statusCode !== 200) {
            return {
              statusCode: 404,
              message: 'Question information is not found',
              data: null,
            }
          }
          const questionItem = Array.isArray(questionResponse.data)
                                ? questionResponse.data[0]
                                : questionResponse.data;
          question[i] = questionItem;
        }
      }
      const exam = this.examRepository.create({
        ...createExamDto,
        questions: question,
      });
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
                          .leftJoinAndSelect('exam.questions', 'question')
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
                              .createQueryBuilder('exam')
                              .leftJoinAndSelect('exam.questions', 'question')
                              .where('exam.deletedAt IS NULL')
                              .andWhere('exam.isActive = :isActive', { isActive: true })
                              .andWhere('exam.id = :id', { id })
                              .getOne();
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
      const examResponse = await this.findOne(id);
      if (examResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Exam information is not found',
          data: null,
        }
      }
      const exam = Array.isArray(examResponse.data)
                  ? examResponse.data[0]
                  : examResponse.data;
      let question:Question[] = [];
      if (updateExamDto.questionId) {
        for(let i = 0; i < updateExamDto.questionId.length; i++) {
          const questionResponse = await this.questionService.findOne(updateExamDto.questionId[i]);
          if (questionResponse.statusCode !== 200) {
            return {
              statusCode: 404,
              message: 'Question information is not found',
              data: null,
            }
          }
          const questionItem = Array.isArray(questionResponse.data)
                                ? questionResponse.data[0]
                                : questionResponse.data;
          question[i] = questionItem;
        }
      }
      const newExam = this.examRepository.create({
        ...exam,
        ...updateExamDto,
        questions: question,
      });
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
