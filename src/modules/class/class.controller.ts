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
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { UseRoles } from 'nest-access-control';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('classes')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'class',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createClassDto: CreateClassDto) {
    return {
      message: 'Create new class successfully',
      metadata: await this.classService.create(createClassDto),
    };
  }

  //  type is in toeic, ielts, toefl
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'class',
    possession: 'own',
  })
  @Get('all/type/:type')
  async findAllByType(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('type') type: string,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Get all classes successfully',
      metadata: await this.classService.findAllByType(
        page,
        limit,
        type,
        status,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'class',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Get all classes successfully',
      metadata: await this.classService.findAll(page, limit, status),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'class',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Get class detail successfully',
      metadata: await this.classService.findOne(+id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'class',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return {
      message: 'Update class successfully',
      metadata: await this.classService.update(+id, updateClassDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'class',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete class successfully',
      metadata: await this.classService.remove(+id),
    };
  }
}
