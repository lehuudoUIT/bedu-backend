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
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Find the list of answers successfully',
      metadata: await this.answerService.findAll(page, limit, status),
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
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Find the list of answers by student and exam successfully',
      metadata: await this.answerService.findAllByStudentAndExam(
        studentId,
        examId,
        page,
        limit,
        status,
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
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Find the list of answers by exam successfully',
      metadata: await this.answerService.findAllByExam(
        examId,
        page,
        limit,
        status,
      ),
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
}
