import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('new')
  async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonService.create(createLessonDto);
  }

  @Get('all')
  findAll(
    @Query ('page') page: number = 1,
    @Query ('limit') limit: number = 10,
  ) {
    return this.lessonService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return this.lessonService.update(+id, updateLessonDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.lessonService.remove(+id);
  }
}
