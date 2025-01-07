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
import { Class } from 'src/entities/class.entity';
import { Course } from 'src/entities/course.entity';
import { ClassService } from '../class/class.service';
import { CourseService } from '../course/course.service';
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
      question
    });

    const result = await this.answerRepository.save(answer);
    if(!result) {
      throw new InternalServerErrorException('Failed to create answer information');
    }
    return result;
  }

  async createByAnswerArray(
    createAnswerDto: CreateAnswerDto[]
  ): Promise<Answer[]> {
    try {
      const answersArray: Answer[] = [];
      for (let i = 0; i < createAnswerDto.length; i++) {
        let answer:Answer = await this.create(createAnswerDto[i]);
        answersArray.push(answer);
      }
      return answersArray;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
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

  async totalPointInExam(
    examId: number,
    userId: number
  ): Promise<number> {
    const totalPoint = await this.answerRepository
                              .createQueryBuilder('answer')
                              .select('SUM(answer.points)', 'total')
                              .where('answer.examId = :examId', { examId })
                              .andWhere('answer.userId = :userId', { userId })
                              .getRawOne();
    return totalPoint.total;
  }

  async examScoreTableOfExam(examId: number) {
    try {
      const examScoreTable = await this.answerRepository
                                      .createQueryBuilder('answer')
                                      .select('answer.examId', 'examId')
                                      .addSelect('answer.userId', 'userId')
                                      .addSelect('answer.testAttempts', 'testAttempts')
                                      .addSelect('SUM(answer.points)', 'total')
                                      .leftJoin('answer.exam', 'exam')
                                      .where('answer.examId = :classId', { examId })
                                      .andWhere('answer.deletedAt is NULL')
                                      .groupBy('answer.examId, answer.userId, answer.testAttempts')
                                      .getRawMany();
      return examScoreTable;
    } catch(error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Bảng điểm của kỳ thi/bài kiểm tra/bài tập
  async getExamResultByExamId(
    examId: number
  ) {
    const examResult = await this.answerRepository
                              .createQueryBuilder('answer')
                              .leftJoinAndSelect('answer.user', 'user')
                              .select([
                                'answer.userId AS userId',
                                'user.name AS name',
                                'answer.testAttempts as attempts',
                                'SUM(answer.points) AS total',
                              ])
                              .where('answer.examId = :examId', { examId })
                              .andWhere('answer.deletedAt is NULL')
                              .groupBy('answer.userId, answer.testAttempts')
                              .getRawMany();
    return examResult;
  }

  async getStatisticalResultByExamId(
    examId: number
  ): Promise<{
    averageScore: number;
    lessThanOne: number;
    greaterThanOrEqualFive: number;
    mostCommonScore: number | null;
    totalTries: number
  }> {

    const subquery = await  this.answerRepository
                              .createQueryBuilder('answer')
                              .leftJoinAndSelect('answer.user', 'user')
                              .select([
                                'answer.userId AS userId',
                                'user.name AS name',
                                'answer.testAttempts as attempts',
                                'SUM(answer.points) AS totalPoints',
                              ])
                              .where('answer.examId = :examId', { examId })
                              .andWhere('answer.deletedAt is NULL')
                              .groupBy('answer.userId, answer.testAttempts')

    const avgQuery = await this.answerRepository
                  .createQueryBuilder()
                  .select(`AVG(sub.totalPoints)`, 'average') 
                  .from(`(${subquery.getQuery()})`, 'sub') 
                  .setParameters(subquery.getParameters())
                  .getRawOne();     

    const lessThanOneCount = await this.answerRepository
                              .createQueryBuilder('answer')
                              .leftJoinAndSelect('answer.user', 'user')
                              .select([
                                'answer.userId AS userId',
                                'user.name AS name',
                                'answer.testAttempts as attempts',
                                'SUM(answer.points) AS total',
                              ])
                              .where('answer.examId = :examId', { examId })
                              .andWhere('answer.deletedAt is NULL')
                              .groupBy('answer.userId, answer.testAttempts')
                              .having('SUM(answer.points) < 1')
                              .getRawMany()
  
    const greaterThanOrEqualFiveCount = await this.answerRepository
                                  .createQueryBuilder('answer')
                                  .leftJoinAndSelect('answer.user', 'user')
                                  .select([
                                    'answer.userId AS userId',
                                    'user.name AS name',
                                    'answer.testAttempts as attempts',
                                    'SUM(answer.points) AS total',
                                  ])
                                  .where('answer.examId = :examId', { examId })
                                  .andWhere('answer.deletedAt is NULL')
                                  .groupBy('answer.userId, answer.testAttempts')
                                  .having('SUM(answer.points) >= 5')
                                  .getRawMany() 
  
      const mostCommonScore = await this.answerRepository
                                  .createQueryBuilder('answer')
                                  .select([
                                    'SUM(answer.points) AS totalPoints',
                                    'COUNT(*) AS occurrences',
                                  ])
                                  .where('answer.examId = :examId', { examId })
                                  .andWhere('answer.deletedAt IS NULL')
                                  .groupBy('answer.userId, answer.testAttempts')
                                  .orderBy('occurrences', 'DESC')
                                  .limit(1)
                                  .getRawOne();                        

      const totalAttempts = await this.answerRepository
                                  .createQueryBuilder('answer')
                                  .leftJoinAndSelect('answer.user', 'user')
                                  .select([
                                    'answer.userId AS userId',
                                    'user.name AS name',
                                    'answer.testAttempts as attempts',
                                    'SUM(answer.points) AS total',
                                  ])
                                  .where('answer.examId = :examId', { examId })
                                  .andWhere('answer.deletedAt is NULL')
                                  .groupBy('answer.userId, answer.testAttempts')
                                  .getRawMany();
                          
    return {
      averageScore: avgQuery.average || 0,
      lessThanOne: lessThanOneCount.length,
      greaterThanOrEqualFive: greaterThanOrEqualFiveCount.length,
      mostCommonScore: Number(mostCommonScore.totalPoints),
      totalTries: totalAttempts.length
    };
  }
  
  async getScoreDistribution(examId: number): Promise<
  { range: string; count: number }[]
> {
  const ranges = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Các khoảng điểm (<1, <2, ..., <10)
  const caseStatements = ranges
    .map(
      (value, index) =>
        `COUNT(CASE WHEN SUM(answer.points) < ${value} THEN 1 END) AS range${value}`
    )
    .join(', ');

  const result = await this.answerRepository
    .createQueryBuilder('answer')
    .select(caseStatements)
    .where('answer.examId = :examId', { examId })
    .andWhere('answer.deletedAt IS NULL')
    .groupBy('answer.examId') // Chỉ cần nhóm theo kỳ thi
    .getRawOne();

  // Chuyển đổi kết quả thành định dạng { range, count }
  const distribution = ranges.map((range) => ({
    range: `< ${range}`,
    count: Number(result[`range${range}`] || 0),
  }));

  return distribution;
}

  
  async tableOfCorrectAndIncorrectRate(
    examId: number,
  ) {
    try {
      const totalStudent = await this.answerRepository
                                    .createQueryBuilder('answer')
                                    .leftJoinAndSelect('answer.exam', 'exam') 
                                    .leftJoinAndSelect('answer.question', 'question') 
                                    .select([
                                      'question.id AS questionId', 
                                      'COUNT(DISTINCT answer.userId) AS participantCount',
                                    ])
                                    .where('answer.examId = :examId', { examId }) 
                                    .andWhere('answer.deletedAt IS NULL') 
                                    .groupBy('question.id') 
                                    .getRawMany();
      const totalAttempt = await this.answerRepository
                                    .createQueryBuilder('answer')
                                    .leftJoinAndSelect('answer.exam', 'exam') 
                                    .leftJoinAndSelect('answer.question', 'question') 
                                    .select([
                                      'question.id AS questionId', 
                                      'COUNT(answer.userId) AS participantCount',
                                    ])
                                    .where('answer.examId = :examId', { examId }) 
                                    .andWhere('answer.deletedAt IS NULL') 
                                    .groupBy('question.id') 
                                    .getRawMany();

      return {
        totalStudent: totalStudent,
        totalAttempt: totalAttempt,
      } ;
    } catch(error) {
      throw new InternalServerErrorException(error.message);
    }
  }

}
