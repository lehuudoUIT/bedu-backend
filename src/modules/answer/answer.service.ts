import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../../entities/answer.entity';
import { QuestionService } from '../question/question.service';
import { ExamService } from '../exam/exam.service';
import {UsersService} from '../users/users.service';
import { Exam } from '../../entities/exam.entity';
import { Question } from '../../entities/question.entity';
// npx jest src/modules/answer/answer.service.spec.ts
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
  ): Promise<Answer> {
    const user = await this.userService.findUserById(createAnswerDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const exam = await this.examService.findOne(createAnswerDto.examId);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const question = await this.questionService.findOne(createAnswerDto.questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }
  
    const scoring = await this.questionService
                                .calculateScore(question.id, createAnswerDto.content);
    // if (!scoring) {
    //   throw new NotFoundException('An error occurred when scoring the answer');
    // }
    createAnswerDto.points = scoring;

    const answer = this.answerRepository.create({
      ...createAnswerDto,
      user,
      exam,
      question,
    });

    const result = await this.answerRepository.save(answer);
    if(!result) {
      throw new InternalServerErrorException('Failed to create answer information');
    }
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    totalRecord: number,
    answers: Answer[]
  }> {
    const allResults = await this.answerRepository
                                .createQueryBuilder('answer')
                                .leftJoinAndSelect('answer.user', 'user')
                                .leftJoinAndSelect('answer.exam', 'exam')
                                .leftJoinAndSelect('answer.question', 'question')
                                .where('answer.deletedAt is NULL')
                                //.andWhere('answer.isActive = :isActive', { isActive: status })
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany();
    const totalRecord = await this.answerRepository
                                .createQueryBuilder('answer')
                                .where('answer.deletedAt is NULL')
                                //.andWhere('answer.isActive = :isActive', { isActive: status })
                                .getCount();

    if (allResults.length === 0) {
    throw new NotFoundException('No answer found');
    }
    return {
      totalRecord: totalRecord,
      answers: allResults
    };
  }

  async findAllByStudentAndExam(
    studentId: number,
    examId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    totalRecord: number,
    answers: Answer[]
  }> {
    const allResults = await this.answerRepository
                                  .createQueryBuilder('answer')
                                  .leftJoinAndSelect('answer.user', 'user')
                                  .leftJoinAndSelect('answer.exam', 'exam')
                                  .leftJoinAndSelect('answer.question', 'question')
                                  .where('answer.deletedAt is NULL')
                                 // .andWhere('answer.isActive = :isActive', { isActive: status })
                                  .andWhere('answer.userId = :studentId', { studentId })
                                  .andWhere('answer.examId = :examId', { examId })
                                  .orderBy('answer.questionId', 'ASC')
                                  .skip((page - 1) * limit)
                                  .take(limit)
                                  .getMany();
    const totalRecord = await this.answerRepository 
                                  .createQueryBuilder('answer')
                                  .where('answer.deletedAt is NULL')
                                 // .andWhere('answer.isActive = :isActive', { isActive: status })
                                  .andWhere('answer.userId = :studentId', { studentId })
                                  .andWhere('answer.examId = :examId', { examId })
                                  .getCount();
    if (allResults.length === 0) {
      throw new NotFoundException('No answer found');
    }
    return {
      totalRecord: totalRecord,
      answers: allResults
    }
  }

  async findAllByExam(
    examId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    totalRecord: number,
    answers: Answer[]
  }> {
    const allResults = await this.answerRepository
                                .createQueryBuilder('answer')
                                .leftJoinAndSelect('answer.user', 'user') 
                                .leftJoinAndSelect('answer.exam', 'exam')
                                .leftJoinAndSelect('answer.question', 'question')
                                .where('answer.deletedAt = :isDeleted is NULL')
                               // .andWhere('answer.isActive = :isActive', { isActive: status })
                                .andWhere('answer.examId = :examId', { examId })
                                .orderBy('answer.userId', 'ASC')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany();
    const  totalRecord = await this.answerRepository
                                .createQueryBuilder('answer')
                                .where('answer.deletedAt is NULL')
                               // .andWhere('answer.isActive = :isActive', { isActive: status })
                                .andWhere('answer.examId = :examId', { examId })
                                .getCount();

    if (allResults.length === 0) {
      throw new NotFoundException('No answer found');
    }
    return {
      totalRecord: totalRecord,
      answers: allResults
    }
  }

  async findOne(
    id: number
  ): Promise<Answer> {
    const result = await this.answerRepository
                          .createQueryBuilder('answer')
                          .leftJoinAndSelect('answer.user', 'user')
                          .leftJoinAndSelect('answer.exam', 'exam')
                          .leftJoinAndSelect('answer.question', 'question')
                          .where('answer.deletedAt is NULL')
                          .andWhere('answer.id = :id', { id })
                          .getOne();
      if (!result) {
        throw new NotFoundException('Answer not found');
      }
      return result;
  }

  async update(
    id: number, 
    updateAnswerDto: UpdateAnswerDto
  ): Promise<Answer> {
    const answer = await this.findOne(id);
      if (!answer) {
        throw new NotFoundException('Answer information is not found');
      } 
      
      const user = await this.userService.findUserById(updateAnswerDto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let exam: Exam;
      if(updateAnswerDto.examId) {
        exam = await this.examService.findOne(updateAnswerDto.examId);
        if (!exam) {
          throw new NotFoundException('Exam not found');
        }
      } else {
        exam = answer.exam;
      }

      let question: Question;
      if(updateAnswerDto.questionId) {
        question = await this.questionService.findOne(updateAnswerDto.questionId);
        if (!question) {
          throw new NotFoundException('Question not found');
        }
      } else {
        question = answer.question;
      }
    
      const scoring= await this.questionService
                                  .calculateScore(question.id, updateAnswerDto.content);
      
      // if ( !scoring) {
      //   throw new NotFoundException('An error occurred when scoring the answer');
      // }
      updateAnswerDto.points = scoring;
      const newAnswer = this.answerRepository.create({
        ...answer,
        ...updateAnswerDto,
        user,
        exam,
        question,
      });
      const result = await this.answerRepository.save(newAnswer);
      if(!result) {
        throw new InternalServerErrorException('Failed to update answer information');
      }
      return result;
  }

  async remove(
    id: number
  ): Promise<Answer> {
    const answer = await this.findOne(id);
      if (!answer) {
        throw new NotFoundException('Answer not found');
      }
      answer.isActive = false;
      answer.deletedAt = new Date();
      const result = await this.answerRepository.save(answer);
      if(!result) {
        throw new InternalServerErrorException('Failed to delete answer information');
      }
      return result;
  }
}
