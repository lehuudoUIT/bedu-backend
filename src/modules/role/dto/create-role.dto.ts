import { IsArray, IsIn, IsString } from 'class-validator';

export class CreateRoleDto {}
export class GrantDto {
  resourceId: number;

  @IsIn([
    'create:any',
    'create:own',
    'read:any',
    'read:own',
    'update:any',
    'update:own',
    'delete:any',
    'delete:own',
  ])
  action: string;
}
