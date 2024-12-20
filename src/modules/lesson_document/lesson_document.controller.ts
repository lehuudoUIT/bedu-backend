import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { LessonDocumentService } from './lesson_document.service';
import { CreateLessonDocumentDto } from './dto/create-lesson_document.dto';
import { UpdateLessonDocumentDto } from './dto/update-lesson_document.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';

@Controller('lesson-document')
@UseFilters(HttpExceptionFilter) 
@UseInterceptors(ResponseFormatInterceptor)

export class LessonDocumentController {
  constructor(private readonly lessonDocumentService: LessonDocumentService) {}

  @Post('new')
  async create(@Body() createLessonDocumentDto: CreateLessonDocumentDto) {
    return {
      message: 'This action adds a new lesson document',
      metadata: await this.lessonDocumentService.create(createLessonDocumentDto),
    }
  }

  @Get('all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Body('status') status: string = 'active'
  ) {
    return {
      message: 'This action returns all lesson document',
      metadata: await this.lessonDocumentService.findAll(page, limit, status),
    }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'This action returns a #${id} lesson document',
      metadata: await this.lessonDocumentService.findOne(+id),
    }
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateLessonDocumentDto: UpdateLessonDocumentDto) {
    return {
      message: 'This action updates a #${id} lesson document',
      metadata: await this.lessonDocumentService.update(+id, updateLessonDocumentDto),
    }
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'This action removes a #${id} lesson document',
      metadata: await this.lessonDocumentService.remove(+id),
    }
  }
}
