import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserProgramService } from './user_program.service';
import { CreateUserProgramDto } from './dto/create-user_program.dto';
import { UpdateUserProgramDto } from './dto/update-user_program.dto';

@Controller('user-program')
export class UserProgramController {
  constructor(private readonly userProgramService: UserProgramService) {}

  @Post()
  create(@Body() createUserProgramDto: CreateUserProgramDto) {
    return this.userProgramService.create(createUserProgramDto);
  }

  @Get()
  findAll() {
    return this.userProgramService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProgramService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserProgramDto: UpdateUserProgramDto) {
    return this.userProgramService.update(+id, updateUserProgramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userProgramService.remove(+id);
  }
}
