import { Injectable } from '@nestjs/common';
import { CreateUserProgramDto } from './dto/create-user_program.dto';
import { UpdateUserProgramDto } from './dto/update-user_program.dto';

@Injectable()
export class UserProgramService {
  create(createUserProgramDto: CreateUserProgramDto) {
    return 'This action adds a new userProgram';
  }

  findAll() {
    return `This action returns all userProgram`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userProgram`;
  }

  update(id: number, updateUserProgramDto: UpdateUserProgramDto) {
    return `This action updates a #${id} userProgram`;
  }

  remove(id: number) {
    return `This action removes a #${id} userProgram`;
  }
}
