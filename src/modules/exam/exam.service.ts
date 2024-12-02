import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dtos/create-exam.dto';
import { UpdateExamDto } from './dtos/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Exam } from 'src/entities/exam.entity';
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
  ): Promise<Exam> {
    let question:Question[] = [];
    if (createExamDto.questionId) {
      for(let i = 0; i < createExamDto.questionId.length; i++) {
        const questionItem = await this.questionService.findOne(createExamDto.questionId[i]);
        if (!questionItem) {
          throw new NotFoundException('Question is not found');
        }
        question[i] = questionItem;
      }
    }
    const exam = this.examRepository.create({
      ...createExamDto,
      questions: question,
    });
    const result = await this.examRepository.save(exam);
    if (!result) {
      throw new InternalServerErrorException('Failed to create exam information');
    }
    return result
  }

  async findAll(
    page: number,
    limit: number,
  ) {
    const exams = await this.examRepository
                          .createQueryBuilder('exam')
                          .leftJoinAndSelect('exam.questions', 'question')
                          .where('exam.deletedAt IS NULL')
                          .andWhere('exam.isActive = :isActive', { isActive: true })
                          .orderBy('exam.id', 'ASC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
    if (exams.length === 0) {
      throw new NotFoundException('No exam found');
    }
    return exams;
  }

  async findAllByType(
    page: number,
    limit: number,
    type: string,
  ): Promise<Exam[]> {
    const exams = await this.examRepository
                          .createQueryBuilder('exam')
                          .leftJoinAndSelect('exam.questions', 'question')
                          .where('exam.deletedAt IS NULL')
                          .andWhere('exam.isActive = :isActive', { isActive: true })
                          .andWhere('exam.examType = :type', { type })
                          .orderBy('exam.id', 'ASC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
    if (exams.length === 0) {
      throw new NotFoundException('No exam found');
    }
    return exams;
  }

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examRepository
                              .createQueryBuilder('exam')
                              .leftJoinAndSelect('exam.questions', 'question')
                              .where('exam.deletedAt IS NULL')
                              .andWhere('exam.isActive = :isActive', { isActive: true })
                              .andWhere('exam.id = :id', { id })
                              .getOne();
    if (!exam) {
      throw new  NotFoundException('Exam not found');
    }

    return exam;
  }

  async update(
    id: number, 
    updateExamDto: UpdateExamDto
  ): Promise<Exam> {
    const exam = await this.findOne(id);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    } 

    let question:Question[] = [];
    if (updateExamDto.questionId) {
      for(let i = 0; i < updateExamDto.questionId.length; i++) {
        const questionItem = await this.questionService.findOne(updateExamDto.questionId[i]);
        if (!questionItem) {
          throw new NotFoundException('Question is not found');
        }
        question[i] = questionItem;
      }
    }
    const newExam = this.examRepository.create({
      ...exam,
      ...updateExamDto,
      questions: question,
    });
    const result = await this.examRepository.save(newExam);
    if (!result) {
      throw new InternalServerErrorException('Failed to update exam information');
    }
    return result;
  }

  async remove(
    id: number
  ): Promise<Exam> {
    const exam = await this.findOne(id);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    exam.isActive = false;
    exam.deletedAt = new Date();
    const result = await this.examRepository.save(exam);
    if (!result) {
      throw new InternalServerErrorException('Failed to delete exam information');
    }
    return result;
  }
}
