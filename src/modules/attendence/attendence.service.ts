import { Injectable } from '@nestjs/common';
import { CreateAttendenceDto } from './dtos/create-attendence.dto';
import { UpdateAttendenceDto } from './dtos/update-attendence.dto';

@Injectable()
export class AttendenceService {
  create(createAttendenceDto: CreateAttendenceDto) {
    return 'This action adds a new attendence';
  }

  findAll() {
    return `This action returns all attendence`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attendence`;
  }

  update(id: number, updateAttendenceDto: UpdateAttendenceDto) {
    return `This action updates a #${id} attendence`;
  }

  remove(id: number) {
    return `This action removes a #${id} attendence`;
  }
}
