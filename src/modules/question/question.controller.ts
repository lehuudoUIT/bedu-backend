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
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dtos/create-question.dto';
import { UpdateQuestionDto } from './dtos/update-question.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('question')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'question',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return {
      message: 'This action adds a new question',
      metadata: await this.questionService.create(createQuestionDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'question',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'This action returns all question',
      metadata: await this.questionService.findAll(page, limit, status),
    };
  }

  // type is in ['multiple', 'single', 'fillin']
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'question',
    possession: 'own',
  })
  @Get('all/type/:type')
  async findAllByType(
    @Param('type') type: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'This action returns all question by type',
      metadata: await this.questionService.findAllByType(
        page,
        limit,
        type,
        status,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'question',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'This action returns a #${id} question',
      metadata: await this.questionService.findOne(id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'question',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return {
      message: 'This action updates a #${id} question',
      metadata: await this.questionService.update(id, updateQuestionDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'question',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete the question successfully',
      metadata: await this.questionService.remove(+id),
    };
  }
}
