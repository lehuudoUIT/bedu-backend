import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseFilters,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';

@Controller('reports')
@UseFilters(HttpExceptionFilter) 
@UseInterceptors(ResponseFormatInterceptor)

export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('new')
  async create(@Body() createReportDto: CreateReportDto) {
    return {
      message: 'Create new report successfully',
      metadata: await this.reportService.create(createReportDto),
    }
  }

  @Get('all/:type')
  async  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Param('type') type: string = 'financial',
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Find the list of reports successfully',
      metadata: await this.reportService.findAll(page, limit, type, status),
    }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find a report successfully',
      metadata: await this.reportService.findOne(+id),
    }
  }

  @Patch('item/:id')
  async update(
    @Param('id') id: string, 
    @Body() updateReportDto: UpdateReportDto) {
      return {
        message: 'Update report information successfully',
        metadata: await this.reportService.update(+id, updateReportDto),
      }
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete report successfully',
      metadata: await this.reportService.remove(+id),
    }
  }
}
