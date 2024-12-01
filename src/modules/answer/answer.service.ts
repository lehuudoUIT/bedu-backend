import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from 'src/entities/answer.entity';
import { QuestionService } from '../question/question.service';
import { ResponseDto } from './common/response.interface';
import { ExamService } from '../exam/exam.service';
import {UsersService} from '../users/users.service';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private  readonly questionService: QuestionService,
    private readonly userService: UsersService,
    private readonly examService: ExamService,
  ) {}

  async create(
    createAnswerDto: CreateAnswerDto
  ): Promise<ResponseDto> {
    try {

      const userResponse = await this.userService.findUserById(createAnswerDto.userId);
      if (!userResponse) {
        return {
          message: 'Student information is not found',
          statusCode: 404,
          data: null,
        }
      }
      const user = Array.isArray(userResponse.data)
                    ? userResponse.data[0]
                    : userResponse.data;

      const examService = await this.examService.findOne(createAnswerDto.examId);
      if (!examService) {
        return {
          message: 'Exam information is not found',
          statusCode: 404,
          data: null,
        }
      }
      const exam = Array.isArray(examService.data)
                    ? examService.data[0]
                    : examService.data;

      const questionResponse = await this.questionService.findOne(createAnswerDto.questionId);
      if (!questionResponse) {
        return {
          message: 'Question not found',
          statusCode: 404,
          data: null,
        }
      }
      const question = Array.isArray(questionResponse.data) 
                            ? questionResponse.data[0] 
                            : questionResponse.data;
    
      const scoringResponse = await this.questionService
                                  .calculateScore(question.id, createAnswerDto.content);
      console.log(scoringResponse);
      if ( scoringResponse.statusCode !== 200) {
        return {
          message: 'An error occurred when scoring the answer',
          statusCode: 500,
          data: null,
        }
      }
      createAnswerDto.points = scoringResponse.data;

      const answer = this.answerRepository.create({
        ...createAnswerDto,
        user,
        exam,
        question,
      });

      const result = await this.answerRepository.save(answer);
      return {
        message: 'Answer created successfully',
        statusCode: 201,
        data: result,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseDto> {
     try {
      const allResults = await this.answerRepository
                              .createQueryBuilder('answer')
                              .leftJoinAndSelect('answer.user', 'user')
                              .leftJoinAndSelect('answer.exam', 'exam')
                              .leftJoinAndSelect('answer.question', 'question')
                              .where('answer.deletedAt is NULL')
                              .andWhere('answer.isActive = :isActive', { isActive: true })
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();

      if (allResults.length === 0) {
        return {
          message: 'No answer found',
          statusCode: 404,
          data: [],
        }
      }
      return {
        message: 'Answers retrieved successfully',
        statusCode: 200,
        data: allResults,
      }
                              
     } catch(error) {
        return {
          message: error.message,
          statusCode: 500,
          data: null,
        }
     }
  }

  async findAllByStudentAndExam(
    studentId: number,
    examId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseDto> {
    try {
      const allResults = await this.answerRepository
                                  .createQueryBuilder('answer')
                                  .leftJoinAndSelect('answer.user', 'user')
                                  .leftJoinAndSelect('answer.exam', 'exam')
                                  .leftJoinAndSelect('answer.question', 'question')
                                  .where('answer.deletedAt is NULL')
                                  .andWhere('answer.isActive = :isActive', { isActive: true })
                                  .andWhere('answer.userId = :studentId', { studentId })
                                  .andWhere('answer.examId = :examId', { examId })
                                  .orderBy('answer.questionId', 'ASC')
                                  .skip((page - 1) * limit)
                                  .take(limit)
                                  .getMany();
      if (allResults.length === 0) {
        return {
          message: 'No answer found',
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: 'Test results of student is retrieved successfully',
        statusCode: 200,
        data: allResults,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async findAllByExam(
    examId: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const allResults = await this.answerRepository
                                .createQueryBuilder('answer')
                                .leftJoinAndSelect('answer.user', 'user')
                                .leftJoinAndSelect('answer.exam', 'exam')
                                .leftJoinAndSelect('answer.question', 'question')
                                .where('answer.deletedAt = :isDeleted is NULL')
                                .andWhere('answer.isActive = :isActive', { isActive: true })
                                .andWhere('answer.examId = :examId', { examId })
                                .orderBy('answer.userId', 'ASC')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany();
      if (allResults.length === 0) {
        return {
          message: 'No answer found',
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: 'Test results of student is retrieved successfully',
        statusCode: 200,
        data: allResults,
      }
    } catch(error) {
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
      const result = await this.answerRepository
                          .createQueryBuilder('answer')
                          .leftJoinAndSelect('answer.user', 'user')
                          .leftJoinAndSelect('answer.exam', 'exam')
                          .leftJoinAndSelect('answer.question', 'question')
                          .where('answer.deletedAt is NULL')
                          .andWhere('answer.isActive = :isActive', { isActive: true })
                          .andWhere('answer.id = :id', { id })
                          .getOne();
      if (!result) {
        return {
          message: 'No answer found',
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: 'Answer retrieved successfully',
        statusCode: 200,
        data: result,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateAnswerDto: UpdateAnswerDto
  ): Promise<ResponseDto> {
    try {
      const answerResponse = await this.findOne(id);
      if (answerResponse.statusCode !== 200) {
        return {
          message: 'Answer not found',
          statusCode: 404,
          data: null,
        }
      } 
      const answer = Array.isArray(answerResponse.data)
                    ? answerResponse.data[0]
                    : answerResponse.data;
      const userResponse = await this.userService.findUserById(updateAnswerDto.userId);
      if (!userResponse) {
        return {
          message: 'Student information is not found',
          statusCode: 404,
          data: null,
        }
      }
      const user = Array.isArray(userResponse.data)
                    ? userResponse.data[0]
                    : userResponse.data;

      const examService = await this.examService.findOne(updateAnswerDto.examId);
      if (!examService) {
        return {
          message: 'Exam information is not found',
          statusCode: 404,
          data: null,
        }
      }
      const exam = Array.isArray(examService.data)
                    ? examService.data[0]
                    : examService.data;

      const questionResponse = await this.questionService.findOne(updateAnswerDto.questionId);
      if (!questionResponse) {
        return {
          message: 'Question not found',
          statusCode: 404,
          data: null,
        }
      }
      const question = Array.isArray(questionResponse.data) 
                            ? questionResponse.data[0] 
                            : questionResponse.data;
    
      const scoringResponse = await this.questionService
                                  .calculateScore(question.id, updateAnswerDto.content);
      
      if ( scoringResponse.statusCode !== 200) {
        return {
          message: 'An error occurred when scoring the answer',
          statusCode: 500,
          data: null,
        }
      }
      updateAnswerDto.points = scoringResponse.data;
      const newAnswer = this.answerRepository.create({
        ...answer,
        ...updateAnswerDto,
        user,
        exam,
        question,
      });
      const result = await this.answerRepository.save(newAnswer);
      return {
        message: 'Answer updated successfully',
        statusCode: 200,
        data: null,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const answerResponse = await this.findOne(id);
      if (answerResponse.statusCode !== 200) {
        return {
          message: 'Answer not found',
          statusCode: 404,
          data: null,
        }
      }
      const answer = Array.isArray(answerResponse.data)
                    ? answerResponse.data[0]
                    : answerResponse.data;
      
      answer.isActive = false;
      answer.deletedAt = new Date();
      const result = await this.answerRepository.save(answer);

      return {
        message: 'Answer deleted successfully',
        statusCode: 200,
        data: result,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }
}
