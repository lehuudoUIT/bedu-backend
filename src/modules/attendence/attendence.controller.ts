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
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dtos/create-attendence.dto';
import { UpdateAttendenceDto } from './dtos/update-attendence.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('attendence')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'attendence',
    possession: 'own',
  })
  @Post('new')
  async create(@Body() createAttendenceDto: CreateAttendenceDto) {
    return {
      message: 'This action adds a new attendence',
      metadata: await this.attendenceService.create(createAttendenceDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'attendence',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'This action returns all attendence',
      metadata: await this.attendenceService.findAll(page, limit),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'attendence',
    possession: 'any',
  })
  @Get('all/lesson/:lessonId')
  async findAllByLesson(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return {
      message: 'This action returns all attendance by lesson',
      metadata: await this.attendenceService.findAllByLessonId(
        lessonId,
        page,
        limit,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'attendence',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'This action returns a #${id} attendence',
      metadata: await this.attendenceService.findOne(+id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'attendence',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAttendenceDto: UpdateAttendenceDto,
  ) {
    return {
      message: 'This action updates a #${id} attendence',
      metadata: await this.attendenceService.update(+id, updateAttendenceDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'attendence',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'This action removes a #${id} attendence',
      metadata: await this.attendenceService.remove(+id),
    };
  }
}
