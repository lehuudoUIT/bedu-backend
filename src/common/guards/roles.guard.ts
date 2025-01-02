import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { identifyAction } from 'src/utils';
// import { Role } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRolesBuilder() private readonly roleBuilder: RolesBuilder,
  ) {}

  canActivate(context: ExecutionContext) {
    const permissionRequirements = this.reflector.get(
      'roles',
      context.getHandler(),
    );

    if (!permissionRequirements || permissionRequirements.length === 0)
      return true;

    const user = context.switchToHttp().getRequest().user;

    const { action, resource, possession } = permissionRequirements[0];

    try {
      const hasPermission = this.roleBuilder
        .can(user.userRole)
        [identifyAction(action, possession)](resource).granted;

      return hasPermission;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException(error.message);
    }
  }
}
