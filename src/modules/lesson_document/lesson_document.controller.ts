import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LessonDocumentService } from './lesson_document.service';
import { CreateLessonDocumentDto } from './dto/create-lesson_document.dto';
import { UpdateLessonDocumentDto } from './dto/update-lesson_document.dto';

@Controller('lesson-document')
export class LessonDocumentController {
  constructor(private readonly lessonDocumentService: LessonDocumentService) {}

  @Post('new')
  create(@Body() createLessonDocumentDto: CreateLessonDocumentDto) {
    return this.lessonDocumentService.create(createLessonDocumentDto);
  }

  @Get('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.lessonDocumentService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.lessonDocumentService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateLessonDocumentDto: UpdateLessonDocumentDto) {
    return this.lessonDocumentService.update(+id, updateLessonDocumentDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.lessonDocumentService.remove(+id);
  }
}
