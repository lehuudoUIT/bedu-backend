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
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dtos/create-answer.dto';
import { UpdateAnswerDto } from './dtos/update-answer.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('answers')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'answer',
    possession: 'own',
  })
  @Post('new')
  async create(@Body() createAnswerDto: CreateAnswerDto) {
    return {
      message: 'Create new answer successfully',
      metadata: await this.answerService.create(createAnswerDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'answer',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'Find the list of answers successfully',
      metadata: await this.answerService.findAll(page, limit),
    };
  }

  // Have not yet tested this route
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'answer',
    possession: 'own',
  })
  @Get('all/student/:studentId/exam/:examId')
  async findAllByStudentAndExam(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('examId', ParseIntPipe) examId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'Find the list of answers by student and exam successfully',
      metadata: await this.answerService.findAllByStudentAndExam(
        studentId,
        examId,
        page,
        limit,
      ),
    };
  }

  // have not yet tested this route
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'answer',
    possession: 'own',
  })
  @Get('all/exam/:examId')
  async findAllByExam(
    @Param('examId', ParseIntPipe) examId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'Find the list of answers by exam successfully',
      metadata: await this.answerService.findAllByExam(examId, page),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'answer',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find an answer successfully',
      metadata: await this.answerService.findOne(+id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'answer',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
  ) {
    return {
      message: 'Update answer information successfully',
      metadata: await this.answerService.update(+id, updateAnswerDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'answer',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete answer successfully',
      metadata: await this.answerService.remove(+id),
    };
  }

  @Post('newArray')
  async submitAnswer(@Body() createAnswerDto: CreateAnswerDto[]) {
    return {
      message: 'Submit answer successfully',
      metadata: await this.answerService.createByAnswerArray(createAnswerDto),
    };
  }

    // Bảng điểm của kỳ thi/bài kiểm tra/bài tập
  @Get('result/:examId')
  async getExamResult(@Param('examId', ParseIntPipe) examId: number) {
    return {
      message: 'Get exam result successfully',
      metadata: await this.answerService.getExamResultByExamId(examId),
    };
  }

  // Lấy các thông tin cơ bản của thống kê như số lần làm bài ,
  // số lượng học viên dưới 1đ,.....
  @Get('basicsStatistical/:examId')
  async getBasicsStatistical(
    @Param('examId', ParseIntPipe) examId: number
  ) {
    return {
      message: 'Get basics statistical successfully',
      metadata: await this.answerService.getStatisticalResultByExamId(examId),
    };
  }

  // Score contributor
  @Get('scoreDistributor/:examId')
  async getScoreDistributor(
    @Param('examId', ParseIntPipe) examId: number
  ) {
    return {
      message: 'Get score distributor successfully',
      metadata: await this.answerService.getScoreDistribution(examId),
    };
  }

  @Get('rate/exam/:examId/question/:questionId')
  async GetTableOfCorrectAndIncorrectRate(
    @Param('examId', ParseIntPipe) examId: number,
    @Param('questionId', ParseIntPipe) questionId: number
  ) {
    return {
      message: 'Get table of correct and incorrect rate successfully',
      metadata: await this.answerService.tableOfCorrectAndIncorrectRate(examId, questionId),
    };
  }
}
