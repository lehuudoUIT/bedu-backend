import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../entities/question.entity';
import {Repository } from 'typeorm';
import { MultipleChoice } from './strategies/multiple-choice-question';
import { SingleChoice } from './strategies/single-choice-question';
import { QuestionStrategy } from './strategies/question-strategy.interface';
import { FillInTheBlankChoice } from './strategies/fill-in-the-blank-question';
import { ExamService } from '../exam/exam.service';
import { Exam } from '../../entities/exam.entity';
import { DocumentService } from '../document/document.service';
import  {Document} from "../../entities/document.entity";

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @Inject(forwardRef(() => ExamService))
    private readonly examService: ExamService,
    private readonly documentService: DocumentService
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto
  ) {
    let exam: Exam[] = [];
      if (createQuestionDto.examId) {
        for(let i = 0; i < createQuestionDto.examId.length; i++) {
          const examItem  = await this.examService.findOne(createQuestionDto.examId[i]);
          if (!examItem) {
            throw new NotFoundException('Exam information is not found');
          }
          exam[i] = examItem;
        }
      }

      let documents: Document[] = [];
      if (createQuestionDto.documentId) {
        for (let i = 0; i < createQuestionDto.documentId.length; i++) {
          const documentItem = await this.documentService.findOne(createQuestionDto.documentId[i]);
          if (!documentItem) {
            throw new NotFoundException('Document information is not found');
          }

          documents[i] = documentItem;
        }
      }

      console.log(exam, documents);

      if (exam.length === 0 && documents.length === 0) {
        throw new NotFoundException('Invalid information: Document and Exam is not found');
      }

      if (createQuestionDto.questionType === "FillInTheBlankChoice"
        && createQuestionDto.answer === null  
      ) {
        if (createQuestionDto.pointDivision === null) {
          throw new NotFoundException('Fill in the blank question should not have point division');
        }
      }
      const question = this.questionRepository.create({
        ...createQuestionDto,
        exam,
        document: documents
      });
      const result = await this.questionRepository.save(question);
      return result;
  }

  private getStrategy(questionType: string): QuestionStrategy {
    switch (questionType) {
      case 'MultipleChoice':
        return new MultipleChoice();
      case 'SingleChoice':
        return new SingleChoice();
      case 'FillInTheBlankChoice':
        return new FillInTheBlankChoice();
      default:
        throw new Error('Unsupported question type');
    }
  }

  checkTotalPointsEqualToDivisionPoint(
    divisionPoint: string,
    totalPoint: number
  ): boolean {
    const divisionValues = divisionPoint.split('/').map(value => parseFloat(value));
    const sumDivision = divisionValues.reduce((acc, currentValue) => acc + currentValue, 0);
    return sumDivision === totalPoint;
  }

  async calculateScore(
    questionId: number,
    studentAnswer: string
  ) {
    const question = await this.findOne(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (this.checkTotalPointsEqualToDivisionPoint(question.pointDivision, question.totalPoints) === false) {
      throw new BadRequestException('Total points is not equal to division point');
    }
    
    const studentAns = studentAnswer.split('/');
    const pointDivision = question.pointDivision.split('/');
    const correctAnswer = question.answer.split('/');

    const scoringStrategy = this.getStrategy(question.questionType);
    const totalPoint =  scoringStrategy.calculateScore(studentAns, correctAnswer, pointDivision, question.totalPoints);
    console.log(totalPoint);
    return totalPoint; 
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    status: string
  ): Promise<{
    totalRecord: number,
    questions: Question[]
  }> {
    const questions = await this.questionRepository
                            .createQueryBuilder('question')
                            .leftJoinAndSelect('question.exam', 'exam')
                            .leftJoinAndSelect('question.document', 'document')
                            .where('question.deletedAt IS NULL')
                            .andWhere('question.isActive = :isActive', { isActive: status })
                            .orderBy('question.id', 'ASC')
                            .skip((page - 1) * limit)
                            .take(limit)
                            .getMany();
    const total = await this.questionRepository
                            .createQueryBuilder('question')
                            .where('question.deletedAt IS NULL')
                            .andWhere('question.isActive = :isActive', { isActive: status })
                            .getCount();
    if (questions.length === 0) {
      throw new NotFoundException('No question found');
    }
    return {
      totalRecord: total,
      questions
    };
  }

  async findAllByType(
    page: number = 1,
    limit: number = 10,
    typeReq: string,
    status: string
  ): Promise<{
    totalRecord: number,
    questions: Question[]
  }> {
    let type: string = "";
    switch (typeReq) {
      case 'multiple':
        type = 'MultipleChoice';
        break;
      case 'single':
        type = 'SingleChoice';
        break;
      case 'fillin':
        type = 'FillInTheBlankChoice';
        break;
      default:
        throw new BadRequestException('Invalid question type');
      }

    const questions = await this.questionRepository
                          .createQueryBuilder('question')
                          .where('question.deletedAt is null')
                          .andWhere('question.isActive = :isActive', { isActive: status })
                          .andWhere('question.questionType = :type', { type })
                          .orderBy('question.id', 'ASC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
    const question = await this.questionRepository
                          .createQueryBuilder('question')
                          .where('question.deletedAt is null')
                          .andWhere('question.isActive = :isActive', { isActive: status })
                          .andWhere('question.questionType = :type', { type })
                          .getCount();      
    if (questions.length === 0) {
      throw new NotFoundException('No question found');
    }
    return {
      totalRecord: question,
      questions
    };
  }

  async findOne(
    id: number
  ) {
    const question = await this.questionRepository
                              .createQueryBuilder('question')
                              .leftJoinAndSelect('question.exam', 'exam')
                              .leftJoinAndSelect('question.document', 'document')
                              .where('question.deletedAt is null')
                              .andWhere('question.id = :id', { id })
                              .getOne();
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async update(
    id: number, 
    updateQuestionDto: UpdateQuestionDto
  ): Promise<Question> {
    const question = await this.findOne(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    let exam: Exam[] = [];
    if (updateQuestionDto.examId) {
      for(let i = 0; i < updateQuestionDto.examId.length; i++) {
        const examItem = await this.examService.findOne(updateQuestionDto.examId[i]);
        if (!examItem) {
          throw new NotFoundException('Exam ' + updateQuestionDto.examId[i] + ' is not found');
        }

        exam[i] = examItem;
      }
    }

    let documents: Document[] = [];
    if (updateQuestionDto.documentId) {
      for (let i = 0; i < updateQuestionDto.documentId.length; i++) {
        const documentItem = await this.documentService.findOne(updateQuestionDto.documentId[i]);
        if (!documentItem) {
          throw new NotFoundException('Document ' + updateQuestionDto.documentId[i] + ' is not found');
        }
        documents[i] = documentItem;
      }
    }

    if (exam.length === 0 && documents.length === 0) {
      throw new NotFoundException('Invalid information: Document and Exam is not found');
    }

    if (updateQuestionDto.questionType === "FillInTheBlankChoice"
      && updateQuestionDto.answer === null  
    ) {
      if (updateQuestionDto.pointDivision === null) {
        throw new NotFoundException('Fill in the blank question should not have point division');
      }
    }
                
    const updatedQuestion = this.questionRepository.create({
      ...question,
      ...updateQuestionDto,
      document: documents,
      exam,
    })
    const result = await this.questionRepository.save(updatedQuestion);
    return result;
  }

  async remove(id: number): Promise<Question> {
    const question = await this.findOne(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const deletedQuestion = this.questionRepository.create({
      ...question,
      isActive: true,
      deletedAt: new Date(),
    });
    const result = await this.questionRepository.save(deletedQuestion);
    return result
  }
}
