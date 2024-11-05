import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dtos/create-program.dto';
import { UpdateProgramDto } from './dtos/update-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from 'src/entities/program.entity';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async create(createProgramDto: CreateProgramDto) {
    return await this.programRepository.insert(createProgramDto);
  }

  async findAll() {
    return await this.programRepository.find();
  }

  async findOne(id: number) {
    return await this.programRepository.findOneBy({ id });
  }

  async update(id: number, updateProgramDto: UpdateProgramDto) {
    return await this.programRepository.update({ id }, updateProgramDto);
  }

  async remove(id: number) {
    return await this.programRepository.delete({ id });
  }
}
