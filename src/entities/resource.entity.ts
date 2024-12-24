import { AbstractEntity } from '../database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RoleResource } from './role_resource.entity';

@Entity({ name: 'resources' })
export class Resource extends AbstractEntity<Resource> {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @OneToMany(() => RoleResource, (roleResource) => roleResource.resource, {
    cascade: true,
    eager: false,
  })
  roleResource: RoleResource[];
}
