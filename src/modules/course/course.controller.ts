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
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('courses')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'course',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createCourseDto: CreateCourseDto) {
    try {
      return {
        message: 'Create new course successfully',
        metadata: await this.courseService.create(createCourseDto),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'course',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'Find the list of courses successfully',
      metadata: await this.courseService.findAll(page, limit),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'course',
    possession: 'own',
  })
  @Get('all/:type')
  async findAllByType(
    @Param('type') type: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'Find the list of courses by type successfully',
      metadata: await this.courseService.findAllByType(type, page, limit),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'course',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find a course successfully',
      metadata: await this.courseService.findOne(+id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'course',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return {
      message: 'Update course information successfully',
      metadata: await this.courseService.update(+id, updateCourseDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'course',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete course successfully',
      metadata: await this.courseService.remove(+id),
    };
  }
}
