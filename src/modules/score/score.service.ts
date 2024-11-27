import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dtos/create-score.dto';
import { UpdateScoreDto } from './dtos/update-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Score } from 'src/entities/score.entity';
import { UsersService } from '../users/users.service';
import { ExamService } from '../exam/exam.service';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    private readonly userService: UsersService,
    private readonly examService: ExamService,
  ) {}

  async create(
    createScoreDto: CreateScoreDto
  ): Promise<ResponseDto> {
    try {
      const userResponse = await this.userService.findUserById(createScoreDto.userId);
      if (userResponse.statusCode !== 200) {
        return {
          message: 'User not found',
          statusCode: 404,
          data: null,
        };
      }
      const user = Array.isArray(userResponse) 
                          ? userResponse[0].data 
                          : userResponse.data;      

      const examResponse = await this.examService.findOne(createScoreDto.examId);
      if (examResponse.statusCode !== 200) {
        return {
          message: 'Exam not found',
          statusCode: 404,
          data: null,
        };
      }
      const exam = Array.isArray(examResponse)
                          ? examResponse[0].data
                          : examResponse.data;

      const checkExist = await this.scoreRepository
                                    .findOneBy({ 
                                      user: user, 
                                      exam: exam,
                                      isActive: true,
                                      deletedAt: IsNull(),
                                    });

      if (checkExist) {
        return {
          message: "The candidate's score in this exam already exists.",
          statusCode: 400,
          data: null,
        };
      }

      const score = this.scoreRepository.create(createScoreDto);
      await this.scoreRepository.save(score);

      return {
        message: 'Score created successfully',
        statusCode: 201,
        data: score,
      };
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
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const scores = await this.scoreRepository
                              .createQueryBuilder('score')
                              .leftJoinAndSelect('score.user', 'user')
                              .leftJoinAndSelect('score.exam', 'exam')
                              .where('score.isActive = :isActive', { isActive: true })
                              .andWhere('score.deletedAt IS NULL')
                              .groupBy('score.id')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const score = await this.scoreRepository
                              .findOneBy({ 
                                id, 
                                isActive: true, 
                                deletedAt: IsNull() }
                              );

      if (!score) {
        return {
          message: 'Score not found',
          statusCode: 404,
          data: null,
        };
      }
      return {
        message: 'Score found',
        statusCode: 200,
        data: score,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async findStudyingResultByStudentId(
    studentId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const userResponse = await this.userService.findUserById(studentId);
      if (userResponse.statusCode !== 200) {
        return {
          message: 'User not found',
          statusCode: 404,
          data: null,
        };
      }
      const user = Array.isArray(userResponse)
                          ? userResponse[0].data
                          : userResponse.data;

      const scores = await this.scoreRepository
                              .createQueryBuilder('score')
                              .leftJoinAndSelect('score.exam', 'exam')
                              .leftJoinAndSelect('score.user', 'user')
                              .where('score.user = :user', { user })
                              .andWhere('score.isActive = :isActive', { isActive: true })
                              .andWhere('score.deletedAt IS NULL')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
      if (!scores) {
        return {
          message: 'Student studying results not found',
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: 'Student studying result found',
        statusCode: 200,
        data: scores,
      }
    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async findStudyingResultByExamId(
    idExam: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
      const examResponse = await this.examService.findOne(idExam);
      if (examResponse.statusCode !== 200) {
        return {
          message: 'Exam not found',
          statusCode: 404,
          data: null,
        };
      }
      const exam = Array.isArray(examResponse)
                          ? examResponse[0].data
                          : examResponse.data;

      const scores = await this.scoreRepository
                              .createQueryBuilder('score')
                              .leftJoinAndSelect('score.user', 'user')
                              .leftJoinAndSelect('score.exam', 'exam')
                              .where('score.exam = :exam', { exam })
                              .andWhere('score.isActive = :isActive', { isActive: true })
                              .andWhere('score.deletedAt IS NULL')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
      if (!scores) {
        return {
          message: 'Student studying results not found',
          statusCode: 404,
          data: null,
        }
      }
      return {
        message: 'Student studying result found',
        statusCode: 200,
        data: scores,
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
    updateScoreDto: UpdateScoreDto
  ) {
    try {
      const scoreResponse = await this.findOne(id);
      if (scoreResponse.statusCode !== 200) {
        return {
          message: 'Score not found',
          statusCode: 404,
          data: null,
        }
      }
      const score = Array.isArray(scoreResponse)
                          ? scoreResponse[0].data
                          : scoreResponse.data;

      const examResponse = await this.examService.findOne(updateScoreDto.examId);
      if (examResponse.statusCode !== 200) {
        return {
          message: 'Exam not found',
          statusCode: 404,
          data: null,
        };
      }
      const exam = Array.isArray(examResponse)
                          ? examResponse[0].data
                          : examResponse.data;
      
      const userResponse = await this.userService.findUserById(updateScoreDto.userId);
      if (userResponse.statusCode !== 200) {
        return {
          message: 'User not found',
          statusCode: 404,
          data: null,
        };
      }
      const user = Array.isArray(userResponse)
                          ? userResponse[0].data
                          : userResponse.data;
      
      const checkExist = await this.scoreRepository
                                    .findOneBy({
                                      user: user,
                                      exam: exam,
                                      isActive: true,
                                      deletedAt: IsNull(),
                                    });
      if (checkExist) {
        return {
          message: "The candidate's score in this exam already exists.",
          statusCode: 400,
          data: null,
        };
      }

      const updatedScore = this.scoreRepository.create({
        ...score,
        ...updateScoreDto,
        exam: exam,
        user: user,
      })

    } catch(error) {
      return {
        message: error.message,
        statusCode: 500,
        data: null,
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const scoreResponse = await this.findOne(id);
      if (scoreResponse.statusCode !== 200) {
        return {
          message: 'Score not found',
          statusCode: 404,
          data: null,
        }
      }
      const score = Array.isArray(scoreResponse)
                          ? scoreResponse[0].data
                          : scoreResponse.data;
      score.isActive = false;
      score.deletedAt = new Date();
      const result = await this.scoreRepository.save(score);
      return {
        message: 'Score deleted successfully',
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
