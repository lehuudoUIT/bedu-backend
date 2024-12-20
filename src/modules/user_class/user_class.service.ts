import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserClassDto } from './dto/create-user_class.dto';
import { UpdateUserClassDto } from './dto/update-user_class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserClass } from '../../entities/user_class.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ClassService } from '../class/class.service';
import { zipAll } from 'rxjs';
import { GoogleService } from '../google/google.service';

@Injectable()
export class UserClassService {
  constructor(
    @InjectRepository(UserClass)
    private userClassRepository: Repository<UserClass>,
    private userService: UsersService,
    private classService: ClassService,
    private googleService: GoogleService,
  ) {}

  async create(createUserClassDto: CreateUserClassDto): Promise<UserClass> {
    if (
      await this.checkExistStudentInClass(
        createUserClassDto.userId,
        createUserClassDto.classId,
      )
    ) {
      throw new BadRequestException('Student already exists in the class');
    }

    const user = await this.userService.findUserById(createUserClassDto.userId);
    if (!user) {
      throw new NotFoundException('User information is not found');
    }

    const classData = await this.classService.findOne(
      createUserClassDto.classId,
    );
    if (!classData) {
      throw new NotFoundException('Class information is not found');
    }

    const userClass = this.userClassRepository.create({
      ...createUserClassDto,
      user: user,
      class: classData,
    });

    const result = await this.userClassRepository.save(userClass);

    try {
      await this.googleService.shareCalendar(classData.calendarId, user.email);
    } catch (error) {
      throw new BadRequestException('Fail to add user to calendar!');
    }

    if (!result) {
      throw new NotFoundException(
        'Failed to create class registration information',
      );
    }
    return result;
  }

  async checkExistStudentInClass(userId: number, classId: number) {
    return await this.userClassRepository
      .createQueryBuilder('user_class')
      .where('user_class.userId = :userId', { userId })
      .andWhere('user_class.classId = :classId', { classId })
      .andWhere('user_class.deletedAt is null')
      .getOne();
  }
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    totalRecord: number;
    userClasses: UserClass[];
  }> {
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
    const total = await this.userClassRepository
      .createQueryBuilder('user_class')
      .where('user_class.deletedAt is null')
      .andWhere('user.isActive = :isActive', { isActive: 1 })
      .getCount();
    if (!userClasses) {
      throw new NotFoundException(
        'Class registration information is not found',
      );
    }
    return {
      totalRecord: total,
      userClasses: userClasses,
    };
  }

  async findAllByClass(
    page: number = 1,
    limit: number = 10,
    idClass: number,
  ): Promise<{
    totalRecord: number;
    userClasses: UserClass[];
  }> {
    const userClasses = await this.userClassRepository
      .createQueryBuilder('user_class')
      .leftJoinAndSelect('user_class.user', 'user')
      .leftJoinAndSelect('user_class.class', 'class')
      .where('user_class.deletedAt is null')
      .andWhere('user.isActive = :isActive', { isActive: 1 })
      .andWhere('class.id = :idClass', { idClass })
      .orderBy('user_class.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
    const total = await this.userClassRepository
      .createQueryBuilder('user_class')
      .where('user_class.deletedAt is null')
      .andWhere('user.isActive = :isActive', { isActive: 1 })
      .andWhere('class.id = :idClass', { idClass })
      .getCount();
    if (userClasses.length === 0) {
      throw new NotFoundException(
        'Class registration information is not found',
      );
    }
    return {
      totalRecord: total,
      userClasses: userClasses,
    };
  }

  async findOne(id: number): Promise<UserClass> {
    const userClass = await this.userClassRepository.findOneBy({
      id,
      isActive: true,
      deletedAt: IsNull(),
    });
    if (!userClass) {
      throw new NotFoundException(
        'Class registration information is not found',
      );
    }
    return userClass;
  }

  async update(
    id: number,
    updateUserClassDto: UpdateUserClassDto,
  ): Promise<UserClass> {
    const userClass = await this.findOne(id);
    if (!userClass) {
      throw new NotFoundException(
        'Class registration information is not found',
      );
    }
    const user = await this.userService.findUserById(updateUserClassDto.userId);
    if (!user) {
      throw new NotFoundException('User information is not found');
    }

    const classData = await this.classService.findOne(
      updateUserClassDto.classId,
    );
    if (!classData) {
      throw new NotFoundException('Class information is not found');
    }

    const updatedUserClass = this.userClassRepository.create({
      ...userClass,
      ...updateUserClassDto,
      user,
      class: classData,
    });
    if (
      this.checkExistStudentInClass(
        updatedUserClass.user.id,
        updatedUserClass.class.id,
      )
    ) {
      throw new BadRequestException('Student already exists in the class');
    }
    const result = await this.userClassRepository.save(updatedUserClass);
    if (!result) {
      throw new NotFoundException(
        'Failed to update class registration information',
      );
    }
    return result;
  }

  async remove(id: number): Promise<UserClass> {
    const deletedUserClass = await this.findOne(id);
    if (!deletedUserClass) {
      throw new NotFoundException(
        'Class registration information is not found',
      );
    }
    deletedUserClass.deletedAt = new Date();
    deletedUserClass.isActive = false;
    const result = await this.userClassRepository.save(deletedUserClass);

    return result;
  }
}
