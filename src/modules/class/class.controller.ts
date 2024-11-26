import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dtos/create-class.dto';
import { UpdateClassDto } from './dtos/update-class.dto';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post('new')
  create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get('all/:type')
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('type') type: string
  ) {
    return this.classService.findAll(page, limit, type);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(+id, updateClassDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}
