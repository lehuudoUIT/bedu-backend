import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserProgramDto } from './dto/create-user_program.dto';
import { UpdateUserProgramDto } from './dto/update-user_program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProgram } from '../../entities/user_program.entity';
import { IsNull, Repository } from 'typeorm';
import {UsersService} from "../users/users.service"
import {ProgramService} from "../program/program.service"

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
  ): Promise<UserProgram> {

    if(await this.checkStudentInProgram(createUserProgramDto.userId, createUserProgramDto.programId)) { 
      throw new InternalServerErrorException('Student already exists in the program');
    }
    const user = await this.userService.findUserById(createUserProgramDto.userId);
    if (!user) {
      throw new NotFoundException('User information is not found');
    }

    const program = await this.programService.findOne(createUserProgramDto.programId);
    if (!program) {
      throw new NotFoundException('Program information is not found');
    }
    
    const userProgram = this.userProgramRepository.create({
      ...createUserProgramDto,
      user,
      program
    });
    const result = await this.userProgramRepository.save(userProgram);
    if(!result) {
      throw new InternalServerErrorException('Failed to create program registration information');
    }
    return result;
    
  }

  async checkStudentInProgram(userId: number, programId: number) {
    return await this.userProgramRepository.createQueryBuilder('user_program')
                                    .where('user_program.userId = :userId', { userId })
                                    .andWhere('user_program.programId = :programId', { programId })
                                    .andWhere('user_program.deletedAt is null')
                                    .getOne(); 
  }

  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<UserProgram[]> {
    const enrollments = await this.userProgramRepository
                                .createQueryBuilder('user_program')
                                .leftJoinAndSelect('user_program.user', 'user')
                                .leftJoinAndSelect('user_program.program', 'program')
                                .where('user_program.deletedAt is null')
                               // .where('user_program.isActive = :isActive', { isActive: status })
                                .orderBy('user_program.createdAt', 'DESC')
                                .skip((page - 1) * limit)
                                .take(limit)
                                .getMany();
    const total = await this.userProgramRepository
                          .createQueryBuilder('user_program')
                          .where('user_program.deletedAt is null')
                         // .where('user_program.isActive = :isActive', { isActive: status })
                          .getCount();    
    if (enrollments.length === 0) {
      throw new NotFoundException('No program registration information found');
    }
    return enrollments;
  }

  async findAllByProgramId(
    programId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    totalRecord: number,
    enrollments: UserProgram[]
  }> {
    try {
      const enrollments = await this.userProgramRepository
                                    .createQueryBuilder('user_program')
                                    .leftJoinAndSelect('user_program.user', 'user')
                                    .leftJoinAndSelect('user_program.program', 'program')
                                    .where('user_program.programId = :programId', { programId })
                                  // .andWhere('user_program.isActive = :isActive', { isActive: status })
                                    .andWhere('user_program.deletedAt is null')
                                    .orderBy('user_program.createdAt', 'DESC')
                                    .skip((page - 1) * limit)
                                    .take(limit)
                                    .getMany();

      const total = await this.userProgramRepository
                            .createQueryBuilder('user_program')
                            .leftJoinAndSelect('user_program.program', 'program')
                            .where('user_program.programId = :programId', { programId })
                            //.andWhere('user_program.isActive = :isActive', { isActive: status })
                            .andWhere('user_program.deletedAt is null')
                            .getCount();
      console.log(total);
      // if (enrollments.length === 0) {
      //   throw new NotFoundException('Program registration information not found');
      // }

      return {
        totalRecord: total,
        enrollments: enrollments
      };
    } catch(error) {
      throw new Error(error);
    }
  }

  async findAllByUserId(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    total: number,
    enrollments: UserProgram[]
  }> {
    const enrollment = await this.userProgramRepository
                                  .createQueryBuilder('user_program')
                                  .leftJoinAndSelect('user_program.user', 'user')
                                  .leftJoinAndSelect('user_program.program', 'program')
                                  .where('user_program.userId = :userId', { userId })
                                 // .andWhere('user_program.isActive = :isActive', { isActive: status })
                                  .andWhere('user_program.deletedAt is null')
                                  .orderBy('user_program.createdAt', 'DESC')
                                  .skip((page - 1) * limit)
                                  .take(limit)
                                  .getMany();
    const total = await this.userProgramRepository
                          .createQueryBuilder('user_program')
                          .where('user_program.userId = :userId', { userId })
                          //.andWhere('user_program.isActive = :isActive', { isActive: status })
                          .andWhere('user_program.deletedAt is null')
                          .getCount();
    if (enrollment.length === 0) {
      throw new NotFoundException('Program registration information not found');
    }
    return {
      total: total,
      enrollments: enrollment
    };
  }

  async findOne(
    id: number
  ): Promise<UserProgram> {
    const enrollment = await this.userProgramRepository
                                    .findOneBy({
                                      id,
                                      deletedAt: IsNull()
                                    });
    if (!enrollment) {
      throw new NotFoundException('Program registration information is not found');
    }
    return enrollment;
  }

  async update(
    id: number, 
    updateUserProgramDto: UpdateUserProgramDto
  ): Promise<UserProgram> {
    const enrollment = await this.findOne(id);
    if (!enrollment) {
      throw new NotFoundException('Program registration information is not found');
    }

    const user = await this.userService.findUserById(updateUserProgramDto.userId);
    if (!user) {
      throw new NotFoundException('User information is not found');
    }

    const program = await this.programService.findOne(updateUserProgramDto.programId);
    if (!program) {
      throw new NotFoundException('Program information is not found');
      return;
    }

    const newEnrollment = this.userProgramRepository.create({
      ...enrollment,
      ...updateUserProgramDto,
      user,
      program
    });
    let checkExist = await this.checkStudentInProgram(newEnrollment.user.id, newEnrollment.program.id);
    if (checkExist) {
      throw new BadRequestException('Student already exists in the program');
    }

    const result = await this.userProgramRepository.save(newEnrollment);
    if (!result) {
      throw new InternalServerErrorException('Failed to update program registration information');
    }
    return result;
  }
  

  async remove(id: number): Promise<UserProgram> {
    const enrollment = await this.findOne(id);
    if (!enrollment) {
      throw new NotFoundException('Program registration information is not found');
    }

    enrollment.deletedAt = new Date();
    enrollment.isActive = false;
    const result = await this.userProgramRepository.save(enrollment);
    if(!result) {
      throw new InternalServerErrorException('Failed to delete program registration information');
    }
    return result;
  }
}
