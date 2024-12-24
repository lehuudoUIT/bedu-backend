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
  UseGuards,
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dtos/create-program.dto';
import { UpdateProgramDto } from './dtos/update-program.dto';
import { HttpExceptionFilter } from '../../common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from '../../common/intercepters/response.interceptor';
import { UseRoles } from 'nest-access-control';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('programs')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'program',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createProgramDto: CreateProgramDto) {
    return {
      message: 'Create new program successfully',
      metadata: await this.programService.create(createProgramDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'program',
    possession: 'own',
  })
  @Get('all/type/:type')
  async findAllByType(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Param('type') type: string,
  ) {
    return {
      message: 'Get all programs successfully',
      metadata: await this.programService.findAllByType(page, limit, type),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'program',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    return {
      message: 'Get all programs successfully',
      metadata: await this.programService.findAll(page, limit),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'program',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Get program detail successfully',
      metadata: await this.programService.findOne(+id),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'program',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
  ) {
    return {
      message: 'Update program successfully',
      metadata: await this.programService.update(+id, updateProgramDto),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'program',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete program successfully',
      metadata: await this.programService.remove(+id),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'program',
    possession: 'own',
  })
  @Post('addNewCourse')
  async addCourseToProgram(
    @Body('programId') programId: number,
    @Body('courseId') courseId: number,
  ) {
    const result = await this.programService.addCourseToProgram(
      programId,
      courseId,
    );
    if (result.program && result.course) {
      return {
        message: 'Add course to program successfully',
        metadata: result,
      };
    } else {
      return {
        message: 'Add course to program failed',
        metadata: null,
      };
    }
  }
}
