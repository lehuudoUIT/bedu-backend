import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { RoleResource } from './role_resource.entity';

@Entity({ name: 'roles' })
export class Role extends AbstractEntity<Role> {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => RoleResource, (roleResource) => roleResource.role, {
    cascade: true,
    eager: false,
  })
  roleResource: RoleResource[];
}
