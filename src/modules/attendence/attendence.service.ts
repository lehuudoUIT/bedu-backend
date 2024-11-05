import { Injectable } from '@nestjs/common';
import { CreateAttendenceDto } from './dtos/create-attendence.dto';
import { UpdateAttendenceDto } from './dtos/update-attendence.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from 'src/entities/attendence.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AttendenceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async create(createAnswerDto: CreateAttendenceDto) {
    return await this.attendanceRepository.insert(createAnswerDto);
  }

  async findAll() {
    return await this.attendanceRepository.find();
  }

  async findOne(id: number) {
    return await this.attendanceRepository.findOneBy({ id });
  }

  async update(id: number, updateAnswerDto: UpdateAttendenceDto) {
    return await this.attendanceRepository.update({ id }, updateAnswerDto);
  }

  async remove(id: number) {
    return await this.attendanceRepository.delete({ id });
  }
}
