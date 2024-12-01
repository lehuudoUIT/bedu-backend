import { Injectable } from '@nestjs/common';
import { CreateUserClassDto } from './dto/create-user_class.dto';
import { UpdateUserClassDto } from './dto/update-user_class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserClass } from 'src/entities/user_class.entity';
import { IsNull, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ClassService } from '../class/class.service';
import { ResponseDto } from './common/response.interface';
 
@Injectable()
export class UserClassService {

  constructor(
    @InjectRepository(UserClass)
    private userClassRepository: Repository<UserClass>,
    private userService: UsersService,
    private classService: ClassService,
  ) {}

  async create(
    createUserClassDto: CreateUserClassDto
  ): Promise<ResponseDto>{ 
    const userResponse = await this.userService.findUserById(createUserClassDto.userId);
    if (userResponse.statusCode !== 200) {
      return {
        statusCode: 200,
        message: "Failed to create class registration information because user is not found",
        data: null
      }
    }
    const user = Array.isArray(userResponse.data)
                  ? userResponse.data[0]
                  : userResponse.data;

    const classResponse = await this.classService.findOne(createUserClassDto.classId);  
    if (classResponse.statusCode !== 200) {
      return {
        statusCode: 200,
        message: "Failed to create class registration information because class is not found",
        data: null
      }
    }
    const classData = Array.isArray(classResponse.data)
                      ? classResponse.data[0]
                      : classResponse.data;
    
    const userClass = this.userClassRepository.create({
      ...createUserClassDto,
      user: user,
      class: classData
    });

    try {
      const result = await this.userClassRepository.save(userClass);
      return {
        statusCode: 201,
        message: "Create class registration information successfully",
        data: result
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
    limit: number = 10
  ): Promise<ResponseDto> {
    try {
      const userClasses = await this.userClassRepository
                          .createQueryBuilder('user_class')
                          .leftJoinAndSelect('user_class.user', 'user')
                          .leftJoinAndSelect('user_class.class', 'class')
                          .where('user_class.deletedAt is null')
                          .andWhere('user.isActive = :isActive', { isActive: 1 })
                          .orderBy('user_class.createdAt', 'DESC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
      if (!userClasses) {
        return {
          statusCode: 404,
          message: 'Class registration information not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Fetch class registration information successfully',
        data: userClasses
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to fetch class registration information',
        data: null
      }
    }
  }

  async findAllByClass(
    page: number = 1,
    limit: number = 10,
    idClass: number
  ) {
    try {
      const userClasses = await this.userClassRepository
                          .createQueryBuilder('user_class')
                          .leftJoinAndSelect('user_class.user', 'user')
                          .leftJoinAndSelect('user_class.class', 'class')
                          .where('user_class.deletedAt is null')
                          .andWhere('user.isActive = :isActive', { isActive: 1 })
                          .andWhere('class.id = :idClass', { idClass})
                          .orderBy('user_class.createdAt', 'DESC')
                          .skip((page - 1) * limit)
                          .take(limit)
                          .getMany();
      if (userClasses.length === 0) {
        return {
          statusCode: 404,
          message: 'Class registration information not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Fetch class registration information successfully',
        data: userClasses
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to fetch class registration information',
        data: null
      }
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const userClass = await this.userClassRepository.findOneBy({
        id,
        isActive: true,
        deletedAt: IsNull()
      });
      if (!userClass) {
        return {
          statusCode: 404,
          message: 'Class registration information not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get class registration information successfully',
        data: userClass
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to get class registration information',
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateUserClassDto: UpdateUserClassDto
  ): Promise<ResponseDto> {
    try {
      const enrollment = await this.findOne(id);
      if (enrollment.statusCode !== 200) {
        return {
          statusCode: 200,
          message: "Failed to update class registration information because class registration is not found",
          data: null
        }
      }
      const userClass = Array.isArray(enrollment.data)
                        ? enrollment.data[0]
                        : enrollment.data;

      const userResponse = await this.userService.findUserById(updateUserClassDto.userId);
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 200,
          message: "Failed to update class registration information because user is not found",
          data: null
        }
      }
      const user = Array.isArray(userResponse.data)
                    ? userResponse.data[0]
                    : userResponse.data;

      const classResponse = await this.classService.findOne(updateUserClassDto.classId);
      if (classResponse.statusCode !== 200) {
        return {
          statusCode: 200,
          message: "Failed to update class registration information because class is not found",
          data: null
        }
      }
      const classData = Array.isArray(classResponse.data)
                      ? classResponse.data[0]
                      : classResponse.data;
      
      const updatedUserClass = this.userClassRepository
                                  .create({
                                    ...userClass,
                                    ...updateUserClassDto,
                                    user,
                                    class: classData
                                  })
      const result = await this.userClassRepository.save(updatedUserClass);
      return {
        statusCode: 200,
        message: 'Update class registration information successfully',
        data: result
      }
      
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update class registration information',
        data: null
      }
    }
  }

  async remove(id: number): Promise<ResponseDto> {
    try {
      const userClass = await this.findOne(id);
      if (userClass.statusCode !== 200) {
        return {
          statusCode: 200,
          message: "Failed to delete class registration information because class registration is not found",
          data: null
        }
      }
      const deletedUserClass = Array.isArray(userClass.data)
                                ? userClass.data[0]
                                : userClass.data;
      deletedUserClass.deletedAt = new Date();
      deletedUserClass.isActive = false;
      const result = await this.userClassRepository.save(deletedUserClass);
      return {
        statusCode: 200,
        message: 'Delete class registration information successfully',
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: 'Failed to delete class registration information',
        data: null
      }
    }
  }
}
