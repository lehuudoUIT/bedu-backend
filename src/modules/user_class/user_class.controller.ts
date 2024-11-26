import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserClassService } from './user_class.service';
import { CreateUserClassDto } from './dto/create-user_class.dto';
import { UpdateUserClassDto } from './dto/update-user_class.dto';

@Controller('user-class')
export class UserClassController {
  constructor(private readonly userClassService: UserClassService) {}

  @Post()
  create(@Body() createUserClassDto: CreateUserClassDto) {
    return this.userClassService.create(createUserClassDto);
  }

  @Get()
  findAll() {
    return this.userClassService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userClassService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserClassDto: UpdateUserClassDto) {
    return this.userClassService.update(+id, updateUserClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userClassService.remove(+id);
  }
}
