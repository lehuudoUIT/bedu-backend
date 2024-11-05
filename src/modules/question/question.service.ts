import { Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    return await this.questionRepository.insert(createQuestionDto);
  }

  async findAll() {
    return await this.questionRepository.find();
  }

  async findOne(id: number) {
    return await this.questionRepository.findOneBy({ id });
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return await this.questionRepository.update({ id }, updateQuestionDto);
  }

  async remove(id: number) {
    return await this.questionRepository.delete({ id });
  }
}
