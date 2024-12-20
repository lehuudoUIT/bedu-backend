import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create.user.dto';
import { RoleService } from '../role/role.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private readonly roleService: RoleService
  ) {}

  async findAllUserByGroup(
    page: number = 1,
    limit: number = 10,
    group: string = "student",
  ): Promise<{
    totalRecord: number,
    users: User[]
  }> {
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
     // console.log("Group user is: ", groupNumber);
      const users = await this.userRepository
                              .createQueryBuilder('user')
                              .select([
                                'user.id',
                                'user.name',
                                'user.cid',
                                'user.email',
                                'user.phone',
                                'user.isActive',
                                'user.createdAt',
                                'user.updatedAt',
                                'user.deletedAt',
                                'user.role',
                                'user.username'
                              ])
                              .where('user.deletedAt IS NULL')
                              .andWhere('user.role.id = :groupId', {groupId: groupNumber})
                              .orderBy('user.createdAt', 'DESC')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
      const totalRecord = await this.userRepository
                                .createQueryBuilder('user')
                                .where('user.deletedAt IS NULL')
                               // .andWhere('user.isActive: isActive', {isActive: status})
                                .andWhere('user.role.id = :groupId', {groupId: group})
                                .getCount();
      if (users.length === 0) {
      throw new Error("No user found");
      }

      return {
        totalRecord,
        users
      }
  }

  extractNumber(str: string): number {
    const match = str.match(/\d+/); 
    return match ? parseInt(match[0], 10) : 0;
  }

  async findMaxCID(): Promise<number> {

    // get the last user in the database   
    const lastUser = await this.userRepository
                              .createQueryBuilder('user')
                              .orderBy('user.id', 'DESC')
                              .getOne();
    if (!lastUser) {
      return 0;
    }
    const cid = lastUser.cid;
    return this.extractNumber(cid);
  }

  async createUser(
    createUserDto: CreateUserDto
  ): Promise<User> {
    try {
      const group = await this.roleService.findOne(createUserDto.groupId);

      if (!group) {
        throw new Error("Group not found");
      }
      const maxCID = await this.findMaxCID();
      let cid=null;

      if (createUserDto.groupId == 1) {
        cid = `STU${maxCID + 1}`;
      } else if (createUserDto.groupId == 2) {
        cid = `TEA${maxCID + 1}`;
      } else if (createUserDto.groupId == 3) {
        cid = `ADM${maxCID + 1}`;
      } else {
        throw new Error("Invalid group");
      }

      //const cid = `CID${maxCID + 1}`;
      const user = this.userRepository.create({
        ...createUserDto,
        role: group,
        cid,
      });
    
      const newUser = await this.userRepository.save(user);
      if(!newUser) {
        throw new Error("Failed to create user");
      }
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
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
                              deletedAt: IsNull()
                            });
      if (!user) {
        throw new NotFoundException("User not found");
      }

      return user
  }

  async grantPermission(
    idUser: number,
    role: number
  ): Promise<User> {
    try {
      const user = await this.findUserById(idUser);
      if (!user) {
        throw new Error("User not found");
      }
      const newRole = await this.roleService.findOne(role);
      if (!newRole) {
        throw new Error("Role not found");
      }
      
      user.role = newRole;
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }
}
