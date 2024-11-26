import { Injectable } from '@nestjs/common';
import { CreateUserClassDto } from './dto/create-user_class.dto';
import { UpdateUserClassDto } from './dto/update-user_class.dto';

@Injectable()
export class UserClassService {
  create(createUserClassDto: CreateUserClassDto) {
    return 'This action adds a new userClass';
  }

  findAll() {
    return `This action returns all userClass`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userClass`;
  }

  update(id: number, updateUserClassDto: UpdateUserClassDto) {
    return `This action updates a #${id} userClass`;
  }

  remove(id: number) {
    return `This action removes a #${id} userClass`;
  }
}
