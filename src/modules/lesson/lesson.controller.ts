import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import {
  CreateLessonDto,
  CreateRecurringLessonDto,
} from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';

@Controller('lessons')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post('new')
  async create(@Body() createLessonDto: CreateLessonDto) {
    return {
      message: 'Create new lesson successfully',
      metadata: await this.lessonService.create(createLessonDto),
    };
  }

  @Post('new-recurring')
  async createRecurring(
    @Body() createRecurringLessonDto: CreateRecurringLessonDto,
  ) {
    return {
      message: 'Create recurring lesson successfully',
      metadata: await this.lessonService.createRecurringLessonForClass(
        createRecurringLessonDto,
      ),
    };
  }

  @Get('all')
  async findAll(

    @Query ('page') page: number = 1,
    @Query ('limit') limit: number = 10
  ) {
    return {
      message: 'Find the list of lessons successfully',
      metadata: await this.lessonService.findAll(page, limit),
    }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find a lesson successfully',
      metadata: await this.lessonService.findOne(+id),
    };
  }

  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    return {
      message: 'Update lesson information successfully',
      metadata: await this.lessonService.update(+id, updateLessonDto),
    };
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Remove lesson successfully',
      metadata: await this.lessonService.remove(+id),
    };
  }
}
