import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('new')
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportService.create(createReportDto);
  }

  @Get('all/:type')
  findAll(
    @Param('page', ParseIntPipe) page: number = 1,
    @Param('limit', ParseIntPipe) limit: number = 10,
    @Param('type') type: string = 'financial'
  ) {
    return this.reportService.findAll();
  }

  @Get('item//:id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

  @Patch('item/:id')
  update(
    @Param('id') id: string, 
    @Body() updateReportDto: UpdateReportDto) {
      return this.reportService.update(+id, updateReportDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
