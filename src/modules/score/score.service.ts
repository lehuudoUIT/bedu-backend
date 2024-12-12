import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateScoreDto } from './dtos/create-score.dto';
import { UpdateScoreDto } from './dtos/update-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Score } from '../../entities/score.entity';
import { UsersService } from '../users/users.service';
import { ExamService } from '../exam/exam.service';
import { ResponseDto } from './common/response.interface';
import { ScoreModule } from './score.module';

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
  ): Promise<Score> {
    const user= await this.userService.findUserById(createScoreDto.userId);
    if (!user) {
      throw new NotFoundException('User information is not found');
    }
     
    const exam = await this.examService.findOne(createScoreDto.examId);
    if (!exam) {
      throw new NotFoundException('Exam information is not found');
    }

    const checkExist = await this.scoreRepository
                                  .createQueryBuilder('score')
                                  .where('score.userId = :user', { user: user.id })
                                  .andWhere('score.examId = :exam', { exam: exam.id })
                                  .andWhere('score.isActive = :isActive', { isActive: true })
                                  .andWhere('score.deletedAt IS NULL')
                                  .getOne();
    console.log(checkExist);
    if (checkExist) {
      throw new BadRequestException('The candidate has already taken the exam');
    }

    const score = this.scoreRepository.create({
      ...createScoreDto,
      user: user,
      exam: exam
    });
    console.log(score);
    const result = await this.scoreRepository.save(score);

    if (!result) {
      throw new InternalServerErrorException('Failed to create score information');
    }

    return score;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<Score[]> {
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

    if (!scores) {
      throw new NotFoundException('No score found');
    }
    return scores;
  }

  async findOne(id: number): Promise<Score> {
    const score = await this.scoreRepository
                            .createQueryBuilder('score')
                            .leftJoinAndSelect('score.user', 'user')
                            .leftJoinAndSelect('score.exam', 'exam')
                            .where('score.id = :id', { id })
                            .andWhere('score.isActive = :isActive', { isActive: true })
                            .andWhere('score.deletedAt IS NULL')
                            .getOne();

    if (!score) {
      throw new NotFoundException('Score information not found');
    }
    return score;
  }

  async findStudyingResultByStudentId(
    studentId: number,
    page: number = 1,
    limit: number = 10,
    examId: number,
  ): Promise<Score[]> {
    const user = await this.userService.findUserById(studentId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const scores = await this.scoreRepository 
                            .createQueryBuilder('score')
                            .leftJoinAndSelect('score.exam', 'exam')
                            .leftJoinAndSelect('score.user', 'user')
                            .where('score.userId = :user', { user })
                            .andWhere('score.examId= :examId', { examId })
                            .andWhere('score.isActive = :isActive', { isActive: true })
                            .andWhere('score.deletedAt IS NULL')
                            .skip((page - 1) * limit)
                            .take(limit)
                            .getMany();
    if (!scores) {
      throw new NotFoundException('Student studying results not found');
    }
    return scores;
  }

  async findStudyingResultByExamId(
    idExam: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<Score[]> {
    const exam = await this.examService.findOne(idExam);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    const scores = await this.scoreRepository
                            .createQueryBuilder('score')
                            .leftJoinAndSelect('score.user', 'user')
                            .leftJoinAndSelect('score.exam', 'exam')
                            .where('score.exam = :exam', { exam: exam.id })
                            .andWhere('score.isActive = :isActive', { isActive: true })
                            .andWhere('score.deletedAt IS NULL')
                            .skip((page - 1) * limit)
                            .take(limit)
                            .getMany();
    if (!scores) {
      throw new NotFoundException('Student studying results not found');
    }
    return scores;
  }

  async update(
    id: number, 
    updateScoreDto: UpdateScoreDto
  ): Promise<Score> {
    const score = await this.findOne(id);
    if (!score) {
      throw new NotFoundException('Score not found');
    }

    let exam;
    if (updateScoreDto.examId) {
      const exam = await this.examService.findOne(updateScoreDto.examId);
      if (!exam) {
        throw new NotFoundException('Exam not found');
      }
    }
      
    let user;
    if (updateScoreDto.userId) {
      user = await this.userService.findUserById(updateScoreDto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    }
    
    const checkExist = await this.scoreRepository
                                  .findOneBy({
                                    user: user,
                                    exam: exam,
                                    isActive: true,
                                    deletedAt: IsNull(),
                                  });
    if (checkExist) {
      throw new NotFoundException('The candidate has already taken the exam');
    }

    const updatedScore = this.scoreRepository.create({
      ...score,
      ...updateScoreDto,
      exam: exam,
      user: user,
    })
    const result = await this.scoreRepository.save(updatedScore);
    if (!result) {
      throw new InternalServerErrorException('Failed to update score information');
    }
    return result;
  }

  async remove(id: number): Promise<Score> {
    const score = await this.findOne(id);
    if (!score) {
      throw new NotFoundException('Score not found');
    }
    score.isActive = false;
    score.deletedAt = new Date();
    const result = await this.scoreRepository.save(score);
    if (!result) {
      throw new InternalServerErrorException('Failed to delete score information');
    }
    return result;
  }
}
