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
import { ExamService } from './exam.service';
import { CreateExamDto } from './dtos/create-exam.dto';
import { UpdateExamDto } from './dtos/update-exam.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('exams')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'exam',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createExamDto: CreateExamDto) {
    return {
      message: 'Create new exam successfully',
      metadata: await this.examService.create(createExamDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'exam',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Find the list of exams successfully',
      metadata: await this.examService.findAll(page, limit, status),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'exam',
    possession: 'own',
  })
  @Get('all/type/:type')
  async findAllByType(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Param('type') type: string,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Find the list of exams by type successfully',
      metadata: await this.examService.findAllByType(page, limit, type, status),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'exam',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find an exam successfully',
      metadata: await this.examService.findOne(+id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'exam',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return {
      message: 'Update exam information successfully',
      metadata: await this.examService.update(+id, updateExamDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'exam',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete exam successfully',
      metadata: await this.examService.remove(+id),
    };
  }
}
