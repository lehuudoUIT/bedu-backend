import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { UserProgramService } from './user_program.service';
import { CreateUserProgramDto } from './dto/create-user_program.dto';
import { UpdateUserProgramDto } from './dto/update-user_program.dto';

@Controller('user-program')
export class UserProgramController {
  constructor(private readonly userProgramService: UserProgramService) {}

  @Post('new')
  create(@Body() createUserProgramDto: CreateUserProgramDto) {
    return this.userProgramService.create(createUserProgramDto);
  }

  @Get("all")
  findAll(
    @Query ('page', ParseIntPipe) page: number = 1,
    @Query ('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.userProgramService.findAll(page, limit);
  }

  @Get("all/program/:id")
  findAllByProgram(
    @Param('id', ParseIntPipe) id: number,
    @Query ('page', ParseIntPipe) page: number = 1,
    @Query ('limit', ParseIntPipe) limit: number = 10
  ) {
    return this.userProgramService.findAllByProgramId(id, page, limit);
  }                                          

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.userProgramService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updateUserProgramDto: UpdateUserProgramDto) {
    return this.userProgramService.update(+id, updateUserProgramDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.userProgramService.remove(+id);
  }
}
