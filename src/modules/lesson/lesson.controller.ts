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
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import {
  CreateLessonDto,
  CreateRecurringLessonDto,
} from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { UseRoles } from 'nest-access-control';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('lessons')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'lesson',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createLessonDto: CreateLessonDto) {
    return {
      message: 'Create new lesson successfully',
      metadata: await this.lessonService.create(createLessonDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'lesson',
    possession: 'any',
  })
  @Post('create-record')
  async createRecord(@Body() body: { lessonId: number; classId: number }) {
    return {
      message: 'Create new lesson successfully',
      metadata: await this.lessonService.getRecordOfLesson(
        body.lessonId,
        body.classId,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'lesson',
    possession: 'any',
  })
  @Post('new-recurring')
  async createRecurring(
    @Body() createRecurringLessonDto: CreateRecurringLessonDto,
  ) {
    try {
      return {
        message: 'Create recurring lesson successfully',
        metadata: await this.lessonService.createRecurringLessonForClass(
          createRecurringLessonDto,
        ),
      };
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'lesson',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: 'Find the list of lessons successfully',
      metadata: await this.lessonService.findAll(page, limit),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'lesson',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find a lesson successfully',
      metadata: await this.lessonService.findOne(+id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'lesson',
    possession: 'own',
  })
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

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'lesson',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Remove lesson successfully',
      metadata: await this.lessonService.remove(+id),
    };
  }
}
