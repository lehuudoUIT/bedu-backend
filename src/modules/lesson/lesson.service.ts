import { Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from 'src/entities/lesson.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    return await this.lessonRepository.insert(createLessonDto);
  }

  async findAll() {
    return await this.lessonRepository.find();
  }

  async findOne(id: number) {
    return await this.lessonRepository.findOneBy({ id });
  }

  async update(id: number, updateLessonDto: UpdateLessonDto) {
    return await this.lessonRepository.update({ id }, updateLessonDto);
  }

  async remove(id: number) {
    return await this.lessonRepository.delete({ id });
  }
}
