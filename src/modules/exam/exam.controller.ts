import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dtos/create-exam.dto';
import { UpdateExamDto } from './dtos/update-exam.dto';

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('new')
  create(@Body() createExamDto: CreateExamDto) {
    return this.examService.create(createExamDto);
  }

  @Get('all')
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,  
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.examService.findAll(page, limit);
  }

  @Get('all/type/:type')
  findAllByType(
    @Query('page', ParseIntPipe) page: number = 1,  
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Param('type') type: string
  ) {
    return this.examService.findAllByType(page, limit, type);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.examService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examService.update(+id, updateExamDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.examService.remove(+id);
  }
}
