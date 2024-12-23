import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseFilters, UseInterceptors } from '@nestjs/common';
import { UserClassService } from './user_class.service';
import { CreateUserClassDto } from './dto/create-user_class.dto';
import { UpdateUserClassDto } from './dto/update-user_class.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';

@Controller('users-classes')
@UseFilters(HttpExceptionFilter) 
@UseInterceptors(ResponseFormatInterceptor)

export class UserClassController {
  constructor(private readonly userClassService: UserClassService) {}

  @Post('new')
  async create(@Body() createUserClassDto: CreateUserClassDto) {
    return {
      message: 'Create a student in class successfully',
      metadata: await this.userClassService.create(createUserClassDto),
    }
  }

  @Get('all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: 'Find the list of student in class successfully',
      metadata: await this.userClassService.findAll(page, limit),
    }
  }

  @Get('all/type/:idClass')
  async findAllByType(
    @Param('type', ParseIntPipe) idClass: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return {
      message: 'Find the list of student in class by type successfully',
      metadata: await this.userClassService.findAllByClass(page, limit, idClass)
    }
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Find a student in class successfully',
      metadata: await this.userClassService.findOne(+id),
    }
  }

  @Patch('item/:id')
  async update(@Param('id') id: string, @Body() updateUserClassDto: UpdateUserClassDto) {
    return {
      message: "Update student's information in class successfully",
      metadata: await this.userClassService.update(+id, updateUserClassDto),
    }
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Remove student from class successfully',
      metadata: await this.userClassService.remove(+id),
    }
  }

  @Get('all/student/:id')
  async findAllByStudent(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return {
      message: 'Find the list of student in class by student successfully',
      metadata: await this.userClassService.findAllByUserId(page, limit, id),
    }
  }
}
