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
import { ScoreService } from './score.service';
import { CreateScoreDto } from './dtos/create-score.dto';
import { UpdateScoreDto } from './dtos/update-score.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('score')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class ScoreController {
  constructor(private readonly scoreService: ScoreService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'score',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createScoreDto: CreateScoreDto) {
    return {
      message: 'This action adds a new score',
      metadata: await this.scoreService.create(createScoreDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'score',
    possession: 'any',
  })
  @Get('all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'This action returns all score',
      metadata: await this.scoreService.findAll(page, limit, status),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'score',
    possession: 'own',
  })
  @Get('all/student/:idStudent/exam/:idExam')
  async findAllResultByIdStudent(
    @Param('idStudent', ParseIntPipe) idStudent: number,
    @Param('idExam', ParseIntPipe) idExam: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'This action returns all score by student',
      metadata: await this.scoreService.findStudyingResultByStudentId(
        page,
        limit,
        idStudent,
        idExam,
        status,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'score',
    possession: 'any',
  })
  @Get('all/exam/:idExam')
  async findAllResultByIdExam(
    @Param('idExam', ParseIntPipe) idExam: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'This action returns all score by exam',
      metadata: await this.scoreService.findStudyingResultByExamId(
        idExam,
        page,
        limit,
        status,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'score',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'This action returns a #${id} score',
      metadata: await this.scoreService.findOne(+id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'score',
    possession: 'any',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateScoreDto: UpdateScoreDto,
  ) {
    return {
      message: 'This action updates a #${id} score',
      metadata: await this.scoreService.update(+id, updateScoreDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'score',
    possession: 'any',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'This action removes a #${id} score',
      metadata: await this.scoreService.remove(+id),
    };
  }
}
