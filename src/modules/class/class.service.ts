import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from 'src/entities/class.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(createClassDto: CreateClassDto) {
    return await this.classRepository.insert(createClassDto);
  }

  async findAll() {
    return await this.classRepository.find();
  }

  async findOne(id: number) {
    return await this.classRepository.findOneBy({ id });
  }

  async update(id: number, updateAnswerDto: UpdateClassDto) {
    return await this.classRepository.update({ id }, updateAnswerDto);
  }

  async remove(id: number) {
    return await this.classRepository.delete({ id });
  }
}
