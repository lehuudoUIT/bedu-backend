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
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dtos/create-attendence.dto';
import { UpdateAttendenceDto } from './dtos/update-attendence.dto';

@Controller('attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post('new')
  create(@Body() createAttendenceDto: CreateAttendenceDto) {
    return this.attendenceService.create(createAttendenceDto);
  }

  @Get('all')
  findAll(
    @Query ('page') page: number = 1,
    @Query ('limit') limit: number = 10,
  ) {
    return this.attendenceService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.attendenceService.findOne(+id);
  }

  @Patch('item/:id')
  update(
    @Param('id') id: string,
    @Body() updateAttendenceDto: UpdateAttendenceDto,
  ) {
    return this.attendenceService.update(+id, updateAttendenceDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.attendenceService.remove(+id);
  }
}
