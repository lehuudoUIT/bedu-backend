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
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('new')
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get('all')
  findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.courseService.findAll(page, limit);
  }

  @Get('all/:type')
  findAllByType(
    @Param('type') type: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.courseService.findAllByType(type, page, limit);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
