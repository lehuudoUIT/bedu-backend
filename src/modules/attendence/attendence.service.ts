import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendenceDto } from './dtos/create-attendence.dto';
import { UpdateAttendenceDto } from './dtos/update-attendence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/entities/attendence.entity';
import { Repository } from 'typeorm';
import { LessonService } from '../lesson/lesson.service';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';
import { Lesson } from 'src/entities/lesson.entity';

@Injectable()
export class AttendenceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly lessService: LessonService,
    private readonly userService: UsersService,
  ) {}

  async create(
    createAnswerDto: CreateAttendenceDto
  ): Promise<Attendance> {
    const user = await this.userService.findUserById(createAnswerDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const lesson = await this.lessService.findOne(createAnswerDto.lessonId);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const checkAttendance = await this.checkAttendance(createAnswerDto.userId, createAnswerDto.lessonId);
    if(checkAttendance) {
      throw new BadRequestException('Attendance already exists');
    }
                    
    const newAttendance = this.attendanceRepository.create({
      ...createAnswerDto,
      user,
      lesson
    });
    const result = await this.attendanceRepository.save(newAttendance);
    if(!result) {
      throw new NotFoundException('Failed to create attendance information');
    }

    return result;
  }
 
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<Attendance[]> {
    const attendance = await this.attendanceRepository
                                  .createQueryBuilder('attendances')
                                  .leftJoinAndSelect('attendances.user', 'user')
                                  .leftJoinAndSelect('attendances.lesson', 'lesson')
                                  .andWhere('attendances.deletedAt IS NULL')
                                  .andWhere('attendances.isActive = :isActive', { isActive: true })
                                  .skip((page - 1) * limit)
                                  .take(limit)
                                  .getMany();
      if (!attendance || attendance.length === 0) {
        throw new NotFoundException('No attendance found');
      }
    return attendance;
  }

  async findAllByLessonId(
    lessonId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<Attendance[]> {
    const attendances = await this.attendanceRepository
                                  .createQueryBuilder('attendances')
                                  .leftJoinAndSelect('attendances.user', 'user')
                                  .leftJoinAndSelect('attendances.lesson', 'lesson')
                                  .where('attendances.lessonId = :lessonId', { lessonId })
                                  .andWhere('attendances.deletedAt IS NULL')
                                  .andWhere('attendances.isActive = :isActive', { isActive: true })
                                  .skip((page - 1) * limit)
                                  .take(limit)
                                  .getMany();
    if (!attendances || attendances.length === 0) {
      throw new NotFoundException('No attendance found');
    }
    return attendances
  }

  async checkAttendance(
    userId: number,
    lessonId: number
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository
                                  .createQueryBuilder('attendances')
                                  .leftJoinAndSelect('attendances.user', 'user')
                                  .leftJoinAndSelect('attendances.lesson', 'lesson')
                                  .where('attendances.userId = :userId', { userId })
                                  .andWhere('attendances.lessonId = :lessonId', { lessonId })
                                  .andWhere('attendances.deletedAt IS NULL')
                                  .andWhere('attendances.isActive = :isActive', { isActive: true })
                                  .getOne();
    return attendance;
  }

  async findOne(
    id: number
  ): Promise<Attendance> {
    const attendance = await this.attendanceRepository
                                  .createQueryBuilder('attendances')
                                  .leftJoinAndSelect('attendances.user', 'user')
                                  .leftJoinAndSelect('attendances.lesson', 'lesson')
                                  .where('attendances.id = :id', { id })
                                  .andWhere('attendances.deletedAt IS NULL')
                                  .andWhere('attendances.isActive = :isActive', { isActive: true })
                                  .getOne();
    
      if (!attendance) {
        throw new NotFoundException('Attendance not found');
      }
      return attendance;
  }

  async update(
    id: number, 
    updateAnswerDto: UpdateAttendenceDto
  ): Promise<Attendance> {
    const attendance = await this.findOne(id);
    if (!attendance) {
      throw new NotFoundException('Attendance information is not found');
    }

    let user: User;
    let lesson: Lesson;

    if(updateAnswerDto.userId) {
      user = await this.userService.findUserById(updateAnswerDto.userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    } else {
      user = attendance.user;
    }

     if(updateAnswerDto.lessonId) {
      lesson = await this.lessService.findOne(updateAnswerDto.lessonId);
      if (!lesson) {
        throw new NotFoundException('Lesson not found');
      }
     } else {
      lesson = attendance.lesson;
     }

    const checkAttendance = await this.checkAttendance(user.id, lesson.id);
    if(checkAttendance) {
      throw new BadRequestException('Attendance already exists');
    }
    
    const newAttendance = await this.attendanceRepository.create({
      ...updateAnswerDto,
      user,
      lesson
    })
    const result = await this.attendanceRepository.save(newAttendance);
    return result 
  }

  async remove(
    id: number
  ): Promise<Attendance> {
    const attendance = await this.findOne(id);
    if (!attendance) {
      throw new NotFoundException('Attendance not found');
    }

    attendance.isActive = false;
    attendance.deletedAt = new Date();

    const result = await this.attendanceRepository.save(attendance);
    return result
  }
}
