import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create.user.dto';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
  ) {}

  async findAllUserByGroup(
    page: number = 1,
    limit: number = 10,
    group: string = "student",
  ): Promise<ResponseDto> {
    let groupNumber: number;

    switch(group) {
      case "student":
        groupNumber = 1;
        break;
      case "teacher":
        groupNumber = 2;
        break;
      case "admin":
        groupNumber = 3;
        break;
      default:
        return {
          statusCode: 400,
          message: "Invalid group user",
          data: null
        }
      }

    try {
      const users = await this.userRepository
                              .createQueryBuilder('user')
                              .where('user.deletedAt IS NULL')
                              .andWhere('user.isActive: isActive', {isActive: true})
                              .andWhere('user.group.id = :groupId', {groupId: group})
                              .orderBy('user.createdAt', 'DESC')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();

      if (users.length === 0) {
        return {
          statusCode: 404,
          message: "User not found",
          data: null
        }
      }

      return {
        statusCode: 200,
        message: "Get all user successfully",
        data: users
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async createUser(
    createUserDto: CreateUserDto
  ): Promise<ResponseDto> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return {
        statusCode: 201,
        message: "Create user successfully",
        data: user
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findUserByUsername(
    username: string
  ): Promise<ResponseDto> {
    try{
      const user = await this.userRepository
                            .findOneBy({
                              username: username,
                              isActive: true,
                              deletedAt: IsNull()
                            });
      if (!user) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null
        }
      }

      return {
        statusCode: 200,
        message: 'Get user successfully',
        data: user
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findUserById(
    id: number
  ): Promise<ResponseDto> {
    try {
      const user = await this.userRepository
                            .findOneBy({
                              id,
                              isActive: true,
                              deletedAt: IsNull()
                            });
      if (!user) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null
        }
      }

      return {
        statusCode: 200,
        message: 'Get user successfully',
        data: user
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
}
