import { Injectable } from '@nestjs/common';
import { CreateScoreDto } from './dtos/create-score.dto';
import { UpdateScoreDto } from './dtos/update-score.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from 'src/entities/score.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  async create(createScoreDto: CreateScoreDto) {
    return await this.scoreRepository.insert(createScoreDto);
  }

  async findAll() {
    return await this.scoreRepository.find();
  }

  async findOne(id: number) {
    return await this.scoreRepository.findOneBy({ id });
  }

  async update(id: number, updateScoreDto: UpdateScoreDto) {
    return await this.scoreRepository.update({ id }, updateScoreDto);
  }

  async remove(id: number) {
    return await this.scoreRepository.delete({ id });
  }
}
