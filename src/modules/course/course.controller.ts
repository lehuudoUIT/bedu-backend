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
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';

@Controller('courses')
@UseFilters(HttpExceptionFilter) 
@UseInterceptors(ResponseFormatInterceptor)

export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('new')
  async create(@Body() createCourseDto: CreateCourseDto) {
    return {
      message: 'Create new course successfully',
      metadata: await this.courseService.create(createCourseDto),
    }
  }

  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return {
      message: 'Find the list of courses successfully',
      metadata: await this.courseService.findAll(page, limit),
    }
  }

  @Get('all/:type')
  async findAllByType(
    @Param('type') type: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10
  ) {
    return {
      message: 'Find the list of courses by type successfully',
      metadata: await this.courseService.findAllByType(type, page, limit),
    }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find a course successfully',
      metadata: await this.courseService.findOne(+id),
    }
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return {
      message: 'Update course information successfully',
      metadata: await this.courseService.update(+id, updateCourseDto),
    }
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete course successfully',
      metadata: await this.courseService.remove(+id),
    }
  }
}
