import { Injectable } from '@nestjs/common';
import { CreateUserProgramDto } from './dto/create-user_program.dto';
import { UpdateUserProgramDto } from './dto/update-user_program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProgram } from 'src/entities/user_program.entity';
import { IsNull, Repository } from 'typeorm';
import {UsersService} from "../users/users.service"
import {ProgramService} from "../program/program.service"
import { ResponseDto } from './common/response.interface';

@Injectable()
export class UserProgramService {

  constructor(
    @InjectRepository(UserProgram)
    private userProgramRepository: Repository<UserProgram>,
    private userService: UsersService,
    private programService: ProgramService,
  ) {}

  async create(
    createUserProgramDto: CreateUserProgramDto
  ): Promise<ResponseDto> {
    const userResponse = await this.userService.findUserById(createUserProgramDto.userId);
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

    const programResponse = await this.programService.findOne(createUserProgramDto.programId);
    if (programResponse.statusCode !== 200) {
      return {
        statusCode: 404,
        message: 'Program not found',
        data: null
      }
    }
    const program = Array.isArray(programResponse.data)
                  ? programResponse.data[0]
                  : programResponse.data;
    
    try {
      const userProgram = this.userProgramRepository.create({
        ...createUserProgramDto,
        user,
        program
      });
      const result = await this.userProgramRepository.save(userProgram);
      return {
        statusCode: 201,
        message: 'Create program registration information successfully',
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to create userProgram',
        data: null
      }
    }
    
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseDto> {
    try {
      const enrollments = await this.userProgramRepository
                                .createQueryBuilder('user_program')
                                .leftJoinAndSelect('user_program.user', 'user')
                                .leftJoinAndSelect('user_program.program', 'program')
                                .where('user_program.deletedAt is null')
                                .orderBy('user_program.createdAt', 'DESC')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany();
      if (enrollments.length === 0) {
        return {
          statusCode: 404,
          message: 'Program registration information not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get program registration information successfully',
        data: enrollments
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get program registration information',
        data: null
      }
    }
  }

  async findAllByProgramId(
    programId: number,
    page: number = 1,
    limit: number = 10
  ) {
    try {
      const enrollments = await this.userProgramRepository
                                .createQueryBuilder('user_program')
                                .leftJoinAndSelect('user_program.user', 'user')
                                .leftJoinAndSelect('user_program.program', 'program')
                                .where('user_program.programId = :programId', { programId })
                                .andWhere('user_program.isActive = 1')
                                .andWhere('user_program.deletedAt is null')
                                .orderBy('user_program.createdAt', 'DESC')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany();
      if (enrollments.length === 0) {
        return { 
          statusCode: 404,
          message: 'Program registration information not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get program registration information by programId successfully',
        data: enrollments
      } 
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get program registration information by programId',
        data: null
      }
    }
  }

  async findAllByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<ResponseDto> {
    try {
      const enrollment = await this.userProgramRepository
                                  .createQueryBuilder('user_program')
                                  .leftJoinAndSelect('user_program.user', 'user')
                                  .leftJoinAndSelect('user_program.program', 'program')
                                  .where('user_program.userId = :userId', { userId })
                                  .andWhere('user_program.isActive = 1')
                                  .andWhere('user_program.deletedAt is null')
                                  .orderBy('user_program.createdAt', 'DESC')
                                  .skip((page - 1) * limit)
                                  .take(limit)
                                  .getMany();
      if (enrollment.length === 0) {
        return {
          statusCode: 404,
          message: 'Program registration information not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get program registration information by userId successfully',
        data: enrollment
      }
      
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to get program registration information by userId',
        data: null
      }
    }
  }

  async findOne(
    id: number
  ): Promise<ResponseDto> {
    try {
      const enrollment = await this.userProgramRepository
                                    .findOneBy({
                                      id,
                                      isActive: true,
                                      deletedAt: IsNull()
                                    });
      if (!enrollment) {
        return {
          statusCode: 404,
          message: 'Program registration information does not exist',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get program registration information successfully',
        data: enrollment
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get program registration information',
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateUserProgramDto: UpdateUserProgramDto
  ): Promise<ResponseDto> {
    try {

      const enrollmentResponse = await this.findOne(id);
      if (!enrollmentResponse || enrollmentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Update enrollment information failed because program registration information does not exist',
          data: null
        };
      }
      const enrollment = Array.isArray(enrollmentResponse.data)
        ? enrollmentResponse.data[0]
        : enrollmentResponse.data;
  
      const userResponse = await this.userService.findUserById(updateUserProgramDto.userId);
      if (!userResponse || userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Update enrollment information failed because user information is not found',
          data: null
        };
      }
      const user = Array.isArray(userResponse.data)
        ? userResponse.data[0]
        : userResponse.data;
  
      const programResponse = await this.programService.findOne(updateUserProgramDto.programId);
      if (!programResponse || programResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Update enrollment information failed because program information is not found',
          data: null
        };
      }
      const program = Array.isArray(programResponse.data)
        ? programResponse.data[0]
        : programResponse.data;

      const newEnrollment = this.userProgramRepository.create({
        ...enrollment,
        ...updateUserProgramDto,
        user,
        program
      });
      const result = await this.userProgramRepository.save(newEnrollment);
        return {
          statusCode: 200,
          message: 'Update userProgram successfully',
          data: result
        };

    } catch (error) {
      return {
        statusCode: 500,
        message: `Internal server error: ${error.message}`,
        data: null
      };
    }
  }
  

  async remove(id: number): Promise<ResponseDto> {
    try {
      const enrollmentResponse = await this.findOne(id);
      if (!enrollmentResponse || enrollmentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Delete enrollment information failed because program registration information does not exist',
          data: null
        };
      }
      const enrollment = Array.isArray(enrollmentResponse.data)
        ? enrollmentResponse.data[0]
        : enrollmentResponse.data;
      enrollment.deletedAt = new Date();
      enrollment.isActive = false;
      const result = await this.userProgramRepository.save(enrollment);
      return {
        statusCode: 200,
        message: 'Delete userProgram successfully',
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to delete userProgram',
        data: null
      }
    }
  }
}
