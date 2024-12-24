import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create.user.dto';
import { UseRoles } from 'nest-access-control';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('groupUser/:groupId')
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    // group is in [student, teacher, admin]
    @Param('groupId') group: string,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: `Find the list of ${group} successfully`,
      metadata: await this.usersService.findAllUserByGroup(
        page,
        limit,
        group,
        status,
      ),
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
}
