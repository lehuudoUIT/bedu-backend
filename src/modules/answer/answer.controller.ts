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
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';

@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('new')
  create(@Body() createAnswerDto: CreateAnswerDto) {
    return this.answerService.create(createAnswerDto);
  }

  @Get('all')
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.answerService.findAll();
  }

  // have not yet tested this route
  @Get('all/student/:studentId/exam/:examId')
  findAllByStudentAndExam(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('examId', ParseIntPipe) examId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.answerService.findAllByStudentAndExam(studentId, examId, page, limit);
  }

  // have not yet tested this route
  @Get('all/exam/:examId')
  findAllByExam(
    @Param('examId', ParseIntPipe) examId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.answerService.findAllByExam(examId, page, limit);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return this.answerService.update(+id, updateAnswerDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.answerService.remove(+id);
  }
}
