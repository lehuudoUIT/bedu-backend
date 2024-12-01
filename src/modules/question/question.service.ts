import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { IsNull, Repository } from 'typeorm';
import { ResponseDto } from './common/response.interface';
import { MultipleChoice } from './strategies/multiple-choice-question';
import { SingleChoice } from './strategies/single-choice-question';
import { QuestionStrategy } from './strategies/question-strategy.interface';
import { ScoringResponse } from './common/scoringResponse.interface';
import { FillInTheBlankChoice } from './strategies/fill-in-the-blank-question';
import { ExamService } from '../exam/exam.service';
import { Exam } from 'src/entities/exam.entity';
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
  ): Promise<ResponseDto> {
    try {
      let exam: Exam[] = [];
      if (createQuestionDto.examId) {
        for(let i = 0; i < createQuestionDto.examId.length; i++) {
          const examResponse = await this.examService.findOne(createQuestionDto.examId[i]);
          if (examResponse.statusCode !== 200) {
            return {
              message: 'Exam ' + createQuestionDto.examId[i] + ' is not found',
              statusCode: 404,
              data: null,
            }
          }
          const examItem = Array.isArray(examResponse.data) 
                            ? examResponse.data[0] 
                            : examResponse.data;
          exam[i] = examItem;
        }
      }

      let documents: Document[] = [];
      if (createQuestionDto.documentId) {
        for (let i = 0; i < createQuestionDto.documentId.length; i++) {
          const documentResponse = await this.documentService.findOne(createQuestionDto.documentId[i]);
          if (documentResponse.statusCode !== 200) {
            return {
              message: 'Document ' + createQuestionDto.documentId[i] + ' is not found',
              statusCode: 404,
              data: null,
            }
          }
          const documentItem = Array.isArray(documentResponse.data)
                                ? documentResponse.data[0]
                                : documentResponse.data;
          documents[i] = documentItem;
        }
      }

      if (exam.length === 0 && documents.length === 0) {
        return {
          message: 'Invalid information: Document and Exam is not found',
          statusCode: 404,
          data: null,
        }
      }

      if (createQuestionDto.questionType === "FillInTheBlankChoice"
        && createQuestionDto.answer === null  
      ) {
        if (createQuestionDto.pointDivision === null) {
          return {
            message: 'Fill in the blank question should not have point division',
            statusCode: 400,
            data: null,
          }
        }
      }
      const question = this.questionRepository.create({
        ...createQuestionDto,
        exam,
        document: documents
      });
      const result = await this.questionRepository.save(question);
      return {
        message: 'Question created successfully',
        statusCode: 201,
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
  ): Promise<ScoringResponse> {
    try {
      const questionResponse = await this.findOne(questionId);
      if (questionResponse.statusCode !== 200) {
        return {
          message: 'Question not found',
          statusCode: 404,
          data: null, 
        };
      }
      const question = Array.isArray(questionResponse.data)
                      ? questionResponse.data[0]
                      : questionResponse.data;

      if (this.checkTotalPointsEqualToDivisionPoint(question.pointDivision, question.totalPoints) === false) {
        return {
          message: 'Total points should be equal to the sum of point division',
          statusCode: 400,
          data: null,
        }
      }
      
      const studentAns = studentAnswer.split('/');
      const pointDivision = question.pointDivision.split('/');
      const correctAnswer = question.answer.split('/');

      const scoringStrategy = this.getStrategy(question.questionType);
      const totalPoint =  scoringStrategy.calculateScore(studentAns, correctAnswer, pointDivision, question.totalPoints);
      return {
        message: 'Score calculated successfully',
        statusCode: 200,
        data: totalPoint,
      }

    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      };
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const questions = await this.questionRepository
                            .createQueryBuilder('question')
                            .where('question.deletedAt IS NULL')
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
    typeReq: string
  ): Promise<ResponseDto> {
    try {
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
          return {
            message: 'Unsupported question type',
            statusCode: 400,
            data: null,
          }
        }

      const questions = await this.questionRepository
                            .createQueryBuilder('question')
                            .where('question.deletedAt is null')
                            .andWhere('question.isActive = :isActive', { isActive: true })
                            .andWhere('question.questionType = :type', { type })
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
                              .createQueryBuilder('question')
                              .where('question.deletedAt is null')
                              .andWhere('question.isActive = :isActive', { isActive: true })
                              .andWhere('question.id = :id', { id })
                              .getOne();
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
      if (questionResponse.statusCode!== 200) {
        return {
          message: 'Question not found',
          statusCode: 404,
          data: null,
        }
      }

      let exam: Exam[] = [];
      if (updateQuestionDto.examId) {
        for(let i = 0; i < updateQuestionDto.examId.length; i++) {
          const examResponse = await this.examService.findOne(updateQuestionDto.examId[i]);
          if (examResponse.statusCode !== 200) {
            return {
              message: 'Exam ' + updateQuestionDto.examId[i] + ' is not found',
              statusCode: 404,
              data: null,
            }
          }
          const examItem = Array.isArray(examResponse.data) 
                            ? examResponse.data[0] 
                            : examResponse.data;
          exam[i] = examItem;
        }
      }

      let documents: Document[] = [];
      if (updateQuestionDto.documentId) {
        for (let i = 0; i < updateQuestionDto.documentId.length; i++) {
          const documentResponse = await this.documentService.findOne(updateQuestionDto.documentId[i]);
          if (documentResponse.statusCode !== 200) {
            return {
              message: 'Document ' + updateQuestionDto.documentId[i] + ' is not found',
              statusCode: 404,
              data: null,
            }
          }
          const documentItem = Array.isArray(documentResponse.data)
                                ? documentResponse.data[0]
                                : documentResponse.data;
          documents[i] = documentItem;
        }
      }

      if (exam.length === 0 && documents.length === 0) {
        return {
          message: 'Invalid information: Document and Exam is not found',
          statusCode: 404,
          data: null,
        }
      }

      if (updateQuestionDto.questionType === "FillInTheBlankChoice"
        && updateQuestionDto.answer === null  
      ) {
        if (updateQuestionDto.pointDivision === null) {
          return {
            message: 'Fill in the blank question should not have point division',
            statusCode: 400,
            data: null,
          }
        }
      }
      const question = Array.isArray(questionResponse.data) 
                      ? questionResponse.data[0] 
                      : questionResponse.data;
                  
      const updatedQuestion = this.questionRepository.create({
        ...question,
        ...updateQuestionDto,
        document: documents,
        exam,
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
