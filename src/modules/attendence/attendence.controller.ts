import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttendenceService } from './attendence.service';
import { CreateAttendenceDto } from './dtos/create-attendence.dto';
import { UpdateAttendenceDto } from './dtos/update-attendence.dto';

@Controller('attendence')
export class AttendenceController {
  constructor(private readonly attendenceService: AttendenceService) {}

  @Post()
  create(@Body() createAttendenceDto: CreateAttendenceDto) {
    return this.attendenceService.create(createAttendenceDto);
  }

  @Get()
  findAll() {
    return this.attendenceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendenceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendenceDto: UpdateAttendenceDto,
  ) {
    return this.attendenceService.update(+id, updateAttendenceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendenceService.remove(+id);
  }
}
