import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { UserProgramService } from './user_program.service';
import { CreateUserProgramDto } from './dto/create-user_program.dto';
import { UpdateUserProgramDto } from './dto/update-user_program.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('users_programs')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class UserProgramController {
  constructor(private readonly userProgramService: UserProgramService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'user-program',
    possession: 'any',
  })
  @Post('new')
  async create(@Body() createUserProgramDto: CreateUserProgramDto) {
    return {
      message: 'Create new user program successfully',
      metadata: await this.userProgramService.create(createUserProgramDto),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'user-program',
    possession: 'any',
  })
  @Get('all')
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Get all user programs successfully',
      metadata: this.userProgramService.findAll(page, limit, status),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'user-program',
    possession: 'any',
  })
  @Get('all/program/:id')
  async findAllByProgram(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Get all user programs by program successfully',
      metadata: this.userProgramService.findAllByProgramId(
        id,
        page,
        limit,
        status,
      ),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'user-program',
    possession: 'own',
  })
  @Get('all/user/:id')
  async findAllByUser(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Get all user enroll the program successfully',
      metadata: await this.userProgramService.findAllByUserId(
        id,
        page,
        limit,
        status,
      ),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'user-program',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Get user program detail successfully',
      metadata: await this.userProgramService.findOne(+id),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'user-program',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserProgramDto: UpdateUserProgramDto,
  ) {
    return {
      message: 'Update user program successfully',
      metadata: await this.userProgramService.update(+id, updateUserProgramDto),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'user-program',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete user program successfully',
      metadata: await this.userProgramService.remove(+id),
    };
  }
}
