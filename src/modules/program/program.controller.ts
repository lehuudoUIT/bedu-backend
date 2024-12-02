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
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dtos/create-program.dto';
import { UpdateProgramDto } from './dtos/update-program.dto';
import { HttpExceptionFilter } from '../../common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from '../../common/intercepters/response.interceptor';

@Controller('programs')
@UseFilters(HttpExceptionFilter) 
@UseInterceptors(ResponseFormatInterceptor)
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post('new')
  async create(@Body() createProgramDto: CreateProgramDto) {
    return {
      message: "Create new program successfully",
      metadata: await this.programService.create(createProgramDto)
    }
  }

  @Get('all/:type')
  async findAll(
    @Query ('page', ParseIntPipe) page: number,
    @Query ('limit', ParseIntPipe) limit: number,
    @Param('type') type: string) {
    return {
      message: "Get all programs successfully",
      metadata: await this.programService.findAll(page, limit, type)
    };
  }

  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: "Get program detail successfully",
      metadata: await this.programService.findOne(+id)
    }
  }

  @Patch('item/:id')
  async update(
    @Param('id') id: string, 
    @Body() updateProgramDto: UpdateProgramDto) {
      return {
        message: "Update program successfully",
        metadata: await this.programService.update(+id, updateProgramDto)
      }
  }

  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: "Delete program successfully",
      metadata: await this.programService.remove(+id)
    }
  }
}
