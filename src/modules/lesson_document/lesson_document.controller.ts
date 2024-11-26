import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LessonDocumentService } from './lesson_document.service';
import { CreateLessonDocumentDto } from './dto/create-lesson_document.dto';
import { UpdateLessonDocumentDto } from './dto/update-lesson_document.dto';

@Controller('lesson-document')
export class LessonDocumentController {
  constructor(private readonly lessonDocumentService: LessonDocumentService) {}

  @Post()
  create(@Body() createLessonDocumentDto: CreateLessonDocumentDto) {
    return this.lessonDocumentService.create(createLessonDocumentDto);
  }

  @Get()
  findAll() {
    return this.lessonDocumentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonDocumentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLessonDocumentDto: UpdateLessonDocumentDto) {
    return this.lessonDocumentService.update(+id, updateLessonDocumentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lessonDocumentService.remove(+id);
  }
}
