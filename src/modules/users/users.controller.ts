import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { UseRoles } from 'nest-access-control';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateUserDto } from './dtos/update.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('groupUser/:groupId')
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    // group is in [student, teacher, admin]
    @Param('groupId') group: string,
  ) {
    return {
      message: `Find the list of ${group} successfully`,
      metadata: await this.usersService.findAllUserByGroup(page, limit, group),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'user',
    possession: 'any',
  })
  @Post('new')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return {
        message: 'Create new user successfully',
        metadata: await this.usersService.createUser(createUserDto),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('item/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Find a user successfully',
      metadata: await this.usersService.findUserById(id),
    };
  }

  @Post('permission/:userId/role/:roleId')
  async grantPermission(
    @Param('userId', ParseIntPipe) idUser: number,
    @Param('roleId', ParseIntPipe) role: number,
  ) {
    return {
      message: 'Grant permission successfully',
      metadata: await this.usersService.grantPermission(idUser, role),
    };
  }

  @Get('cid/:cid')
  async findByCid(@Param('cid') cid: string) {
    return {
      message: 'Find a user by CID successfully',
      metadata: await this.usersService.findUserByCid(cid),
    };
  }

  @Patch('item/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      message: 'Update user successfully',
      metadata: await this.usersService.update(id, updateUserDto),
    };
  }

  @Delete('item/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Remove user successfully',
      metadata: await this.usersService.remove(id),
    };
  }
}
