import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("groupUser/:groupId")
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    // group is in [student, teacher, admin]
    @Param('groupId') group: string,
  ) {
    return await this.usersService.findAllUserByGroup(page, limit, group);
  }

  @Post('new')
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('item/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findUserById(id);
  }
}
