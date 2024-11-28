import { Injectable } from '@nestjs/common';
import { CreateAttendenceDto } from './dtos/create-attendence.dto';
import { UpdateAttendenceDto } from './dtos/update-attendence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/entities/attendence.entity';
import { Repository } from 'typeorm';
import { LessonService } from '../lesson/lesson.service';
import { UsersService } from '../users/users.service';
import { ResponseDto } from './common/response.interface';

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
  ): Promise<ResponseDto> {
    try {
      const userResponse = await this.userService.findUserById(createAnswerDto.userId);
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null
        }
      }
      const lessonResponse = await this.lessService.findOne(createAnswerDto.lessonId);
      if (lessonResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Lesson not found',
          data: null
        }
      }
      const user = Array.isArray(userResponse.data)
                  ? userResponse.data[0]
                  : userResponse.data;
      const lesson = Array.isArray(lessonResponse.data)
                  ? lessonResponse.data[0]
                  : lessonResponse.data;    
      const newAttendance = this.attendanceRepository.create({
        ...createAnswerDto,
        user,
        lesson
      });
      const result = await this.attendanceRepository.save(newAttendance);
      
      return {
        statusCode: 201,
        message: 'Create attendance successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
 
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseDto> {
    try {
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
        return {
          statusCode: 404,
          message: 'Attendance not found',
          data: null
        }
      }
    return {
      statusCode: 200,
      message: 'Get attendance successfully',
      data: attendance
    } 

    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findOne(
    id: number
  ): Promise<ResponseDto> {
    try {
      const attendance = await this.attendanceRepository
                                  .createQueryBuilder('attendances')
                                  .leftJoinAndSelect('attendances.user', 'user')
                                  .leftJoinAndSelect('attendances.lesson', 'lesson')
                                  .where('attendances.id = :id', { id })
                                  .andWhere('attendances.deletedAt IS NULL')
                                  .andWhere('attendances.isActive = :isActive', { isActive: true })
                                  .getOne();
    
      if (!attendance) {
        return {
          statusCode: 404,
          message: 'User has not joined the class yet',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get attendance successfully',
        data: attendance
      }

    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async update(id: number, updateAnswerDto: UpdateAttendenceDto) {
    try {
      const attendance = await this.findOne(id);
      if (attendance.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Attendance not found',
          data: null
        }
      }

      const userResponse = await this.userService.findUserById(updateAnswerDto.userId);
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null
        }
      }
      const user = Array.isArray(userResponse.data)
                  ? userResponse.data[0]
                  : userResponse.data;

      const lessonResponse = await this.lessService.findOne(updateAnswerDto.lessonId);
      if (lessonResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Lesson not found',
          data: null
        }
      }
      const lesson = Array.isArray(lessonResponse.data)
                  ? lessonResponse.data[0]
                  : lessonResponse.data;
      
      const newAttendance = await this.attendanceRepository.create({
        ...updateAnswerDto,
        user,
        lesson
      })
      const result = await this.attendanceRepository.save(newAttendance);
      return {
        statusCode: 200,
        message: 'Update attendance successfully',
        data: result
      }

    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const attendanceResponse = await this.findOne(id);
      if (attendanceResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Attendance not found',
          data: null
        }
      }
      const attendance = Array.isArray(attendanceResponse.data)
                        ? attendanceResponse.data[0]
                        : attendanceResponse.data;
      attendance.isActive = false;
      attendance.deletedAt = new Date();

      const result = await this.attendanceRepository.save(attendance);

      return {
        statusCode: 200,
        message: 'Delete attendance successfully',
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
}
