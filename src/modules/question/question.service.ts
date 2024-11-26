import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { IsNull, Repository } from 'typeorm';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto
  ): Promise<ResponseDto> {
    try {
      const question = this.questionRepository.create(createQuestionDto);
      const result = await this.questionRepository.save(question);
      return {
        message: 'Question created successfully',
        statusCode: 201,
        data: result,
      }
    } catch (error) {
      return {
        message: 'An error occurred',
        statusCode: 500,
        data: null,
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const questions = await this.questionRepository
                            .createQueryBuilder('question')
                            .where('question.isDeleted = :isDeleted', { isDeleted: false })
                            .andWhere('question.isActive = :isActive', { isActive: true })
                            .orderBy('question.id', 'ASC')
                            .skip((page - 1) * limit)
                            .take(limit)
                            .getMany();
      if (questions.length === 0) {
        return {
          message: 'No question found',
          statusCode: 404,
          data: [],
        }
      }
      return {
        message: 'Questions retrieved successfully',
        statusCode: 200,
        data: questions,
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async findAllByType(
    page: number = 1,
    limit: number = 10,
    type: string
  ): Promise<ResponseDto> {
    try {
      const questions = await this.questionRepository
                            .createQueryBuilder('question')
                            .where('question.isDeleted = :isDeleted', { isDeleted: false })
                            .andWhere('question.isActive = :isActive', { isActive: true })
                            .andWhere('question.type = :type', { type })
                            .orderBy('question.id', 'ASC')
                            .skip((page - 1) * limit)
                            .take(limit)
                            .getMany();
      if (questions.length === 0) {
        return {
          message: 'No question found',
          statusCode: 404,
          data: [],
        }
      }
      return {
        message: 'Questions retrieved successfully',
        statusCode: 200,
        data: questions,
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async findOne(
    id: number
  ): Promise<ResponseDto> {
    try {
      const question = await this.questionRepository
                                .findOneBy({
                                  id,
                                  deletedAt: IsNull(),
                                  isActive: true,
                                });
      if (!question) {
        return {
          message: 'Question not found',
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: 'Question retrieved successfully',
        statusCode: 200,
        data: question,
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async update(
    id: number, 
    updateQuestionDto: UpdateQuestionDto
  ): Promise<ResponseDto> {
    try {
      const questionResponse = await this.findOne(id);
      if (questionResponse.statusCode !== 200) {
        return {
          message: 'Question not found',
          statusCode: 404,
          data: null,
        }
      }
      const question = Array.isArray(questionResponse.data) 
                      ? questionResponse.data[0] 
                      : questionResponse.data;
      const updatedQuestion = this.questionRepository.create({
        ...question,
        ...updateQuestionDto
      })
      const result = await this.questionRepository.save(updatedQuestion);
      return {
        message: 'Question updated successfully',
        statusCode: 200,
        data: result,
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const questionResponse = await this.findOne(id);
      if (questionResponse.statusCode !== 200) {
        return {
          message: 'Question not found',
          statusCode: 404,
          data: null,
        }
      }
      const question = Array.isArray(questionResponse.data) 
                      ? questionResponse.data[0] 
                      : questionResponse.data;
      const deletedQuestion = this.questionRepository.create({
        ...question,
        isActive: true,
        deletedAt: new Date(),
      });
      const result = await this.questionRepository.save(deletedQuestion);
      return {
        message: 'Question deleted successfully',
        statusCode: 200,
        data: result,
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }
}
