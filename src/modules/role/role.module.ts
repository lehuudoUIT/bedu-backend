import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../../entities/role.entity';
import { Resource } from 'src/entities/resource.entity';
import { RoleResource } from 'src/entities/role_resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Resource, RoleResource])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
