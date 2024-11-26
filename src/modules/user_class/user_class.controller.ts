import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UserClassService } from './user_class.service';
import { CreateUserClassDto } from './dto/create-user_class.dto';
import { UpdateUserClassDto } from './dto/update-user_class.dto';

@Controller('user-class')
export class UserClassController {
  constructor(private readonly userClassService: UserClassService) {}

  @Post('new')
  create(@Body() createUserClassDto: CreateUserClassDto) {
    return this.userClassService.create(createUserClassDto);
  }

  @Get('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userClassService.findAll(page, limit);
  }

  @Get('all/type/:idClass')
  findAllByType(
    @Param('type', ParseIntPipe) idClass: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.userClassService.findAllByClass(page, limit, idClass);
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.userClassService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateUserClassDto: UpdateUserClassDto) {
    return this.userClassService.update(+id, updateUserClassDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.userClassService.remove(+id);
  }
}
