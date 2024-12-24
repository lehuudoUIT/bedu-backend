import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { Resource } from './resource.entity';

@Entity({ name: 'role_resource' })
export class RoleResource extends AbstractEntity<RoleResource> {
  @Column()
  action: string;

  @Column({ default: '*' })
  attribute: string;

  @ManyToOne(() => Role, (role) => role.roleResource, {
    onDelete: 'CASCADE',
  })
  role: Role;

  @ManyToOne(() => Resource, (resource) => resource.roleResource, {
    onDelete: 'CASCADE',
  })
  resource: Resource;
}
