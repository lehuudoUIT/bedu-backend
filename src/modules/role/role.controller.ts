import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, GrantDto } from './dto/create-role.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'role',
    possession: 'any',
  })
  @Get()
  async getAllRole() {
    return {
      message: 'Get role list successfully!',
      metadata: await this.roleService.getAllRole(),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'role',
    possession: 'any',
  })
  @Get('grant-all')
  async getAllGrantRole() {
    return {
      message: 'Get grant list successfully!',
      metadata: await this.roleService.getApplicationGrantList(),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'role',
    possession: 'any',
  })
  @Get('grant/:id')
  async getListGrantOfRole(@Param('id') id: number) {
    return {
      message: 'Get role list successfully!',
      metadata: await this.roleService.roleList(id),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'role',
    possession: 'any',
  })
  @Post()
  async createRole(@Body() body: { name: string; description: string }) {
    return {
      message: 'Create role list successfully!',
      metadata: await this.roleService.createRole(body.name, body.description),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'role',
    possession: 'any',
  })
  @Get('resource')
  async getAllResource() {
    return {
      message: 'Get resource list successfully!',
      metadata: await this.roleService.resourceList(),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'role',
    possession: 'any',
  })
  @Post('resource')
  async createResource(@Body() body: { name: string; description: string }) {
    return {
      message: 'Create resource list successfully!',
      metadata: await this.roleService.createResource(
        body.name,
        body.description,
      ),
    };
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'role',
    possession: 'any',
  })
  @Post('grant')
  async grantRoleResouce(@Body() body: { roleId: number; grants: GrantDto[] }) {
    return {
      message: 'grant resource to role successfully!',
      metadata: await this.roleService.grantRoleResoure(
        body.roleId,
        body.grants,
      ),
    };
  }
}
