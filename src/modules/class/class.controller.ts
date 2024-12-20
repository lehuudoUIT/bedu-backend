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
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';

@Controller('classes')
@UseFilters(HttpExceptionFilter) 
@UseInterceptors(ResponseFormatInterceptor)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('new')
  async create(@Body() createClassDto: CreateClassDto) {
    return {
      message: 'Create new class successfully',
      metadata: await this.classService.create(createClassDto),
    }
  }

  //  type is in toeic, ielts, toefl
  @Get('all/type/:type')
  async findAllByType(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('type') type: string,
    @Body('status') status: string = 'active'
  ) {
    return {
      message: 'Get all classes successfully',
      metadata: await this.classService.findAllByType(page, limit, type, status),
    }
  }

  @Get("all")
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body('status') status: string = 'active'
  ) {
    return {
      message: 'Get all classes successfully',
      metadata: await this.classService.findAll(page, limit, status),
    }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Get class detail successfully',
      metadata: await this.classService.findOne(+id),
    }
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return {
      message: 'Update class successfully',
      metadata: await this.classService.update(+id, updateClassDto),
    }
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete class successfully',
      metadata: await this.classService.remove(+id),
    }
  }
}
