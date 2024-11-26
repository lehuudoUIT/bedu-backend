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
} from '@nestjs/common';
import { ProgramService } from './program.service';
import { CreateProgramDto } from './dtos/create-program.dto';
import { UpdateProgramDto } from './dtos/update-program.dto';

@Controller('program')
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @Post('new')
  create(@Body() createProgramDto: CreateProgramDto) {
    return this.programService.create(createProgramDto);
  }

  @Get('all/:type')
  findAll(
    @Query ('page', ParseIntPipe) page: number,
    @Query ('limit', ParseIntPipe) limit: number,
    @Param('type') type: string) {
    return this.programService.findAll(page, limit, type);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.programService.findOne(+id);
  }

  @Patch('item/:id')
  update(
    @Param('id') id: string, 
    @Body() updateProgramDto: UpdateProgramDto) {
      return this.programService.update(+id, updateProgramDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.programService.remove(+id);
  }
}
