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
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';

@Controller('answers')
@UseFilters(HttpExceptionFilter) 
@UseInterceptors(ResponseFormatInterceptor)

export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post('new')
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    return {
      message: 'Create new answer successfully',
      metadata: await this.answerService.create(createAnswerDto),
    }
  }

  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'Find the list of answers successfully',
      metadata: await this.answerService.findAll(page, limit),
    }
  }

  // Have not yet tested this route
  @Get('all/student/:studentId/exam/:examId')
  async findAllByStudentAndExam(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('examId', ParseIntPipe) examId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'Find the list of answers by student and exam successfully',
      metadata: await this.answerService.findAllByStudentAndExam(studentId, examId, page, limit),
    }
  }

  // have not yet tested this route
  @Get('all/exam/:examId')
  async findAllByExam(
    @Param('examId', ParseIntPipe) examId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'Find the list of answers by exam successfully',
      metadata: await this.answerService.findAllByExam(examId, page, limit)
    }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find an answer successfully',
      metadata: await this.answerService.findOne(+id),
    }
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto) {
    return {
      message: 'Update answer information successfully',
      metadata: await this.answerService.update(+id, updateAnswerDto),
    }
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete answer successfully',
      metadata: await this.answerService.remove(+id),
    }
  }
}
