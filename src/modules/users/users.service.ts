import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
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
  ): Promise<User[]> {
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
        throw new Error("Invalid group");
      }

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
      throw new Error("No user found");
      }

      return users
  }

  async createUser(
    createUserDto: CreateUserDto
  ): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const newUser = await this.userRepository.save(user);
    if(!newUser) {
      throw new Error("Failed to create user");
    }
    return newUser;
  }

  async findUserByUsername(
    username: string
  ): Promise<User> {
    const user = await this.userRepository
                            .findOneBy({
                              username: username,
                              isActive: true,
                              deletedAt: IsNull()
                            });
    if (!user) {
        throw new NotFoundException("User not found");
    }

    return user;
  }

  async findUserById(
    id: number
  ): Promise<User> {
    const user = await this.userRepository
                            .findOneBy({
                              id,
                              isActive: true,
                              deletedAt: IsNull()
                            });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      return user
  }
}
