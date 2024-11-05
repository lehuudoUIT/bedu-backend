import { Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from 'src/entities/answer.entity';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(createAnswerDto: CreateAnswerDto) {
    return await this.answerRepository.insert(createAnswerDto);
  }

  async findAll() {
    return await this.answerRepository.find();
  }

  async findOne(id: number) {
    return await this.answerRepository.findOneBy({ id });
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto) {
    return await this.answerRepository.update({ id }, updateAnswerDto);
  }

  async remove(id: number) {
    return await this.answerRepository.delete({ id });
  }
}
