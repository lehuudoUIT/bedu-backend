import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dtos/create-exam.dto';
import { UpdateExamDto } from './dtos/update-exam.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from 'src/entities/exam.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto) {
    return await this.examRepository.insert(createExamDto);
  }

  async findAll() {
    return await this.examRepository.find();
  }

  async findOne(id: number) {
    return await this.examRepository.findOneBy({ id });
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    return await this.examRepository.update({ id }, updateExamDto);
  }

  async remove(id: number) {
    return await this.examRepository.delete({ id });
  }
}
