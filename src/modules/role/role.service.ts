import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from 'src/entities/resource.entity';
import { Role } from 'src/entities/role.entity';
import { RoleResource } from 'src/entities/role_resource.entity';
import { Repository } from 'typeorm';
import { GrantDto } from './dto/create-role.dto';
import { filterByProperty } from 'src/utils';
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(RoleResource)
    private readonly roleResourceRepository: Repository<RoleResource>,
  ) {}

  async createResource(name: string, description: string) {
    try {
      const resourceData = this.resourceRepository.create({
        name,
        description,
      });
      return await this.resourceRepository.save(resourceData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  //resourceList
  async resourceList(page: number = 1, limit: number = 30) {
    try {
      const resources = await this.resourceRepository
        .createQueryBuilder('resource')
        .where('resource.deletedAt IS NULL')
        .orderBy('resource.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      const totalRecord = await this.resourceRepository
        .createQueryBuilder('resource')
        .where('resource.deletedAt IS NULL')
        .getCount();

      return {
        resources,
        totalRecord,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  //createRole
  async createRole(name: string, description: string) {
    try {
      // 1. Create role
      const roleData = this.roleRepository.create({ name, description });
      return await this.roleRepository.save(roleData);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async grantRoleResoure(roleId: number, grants: GrantDto[]) {
    try {
      console.log('roleId:::', roleId);

      const roleData = await this.roleRepository.findOneBy({ id: roleId });

      console.log(roleData);

      if (!roleData) throw new NotFoundException('Role không tồn tại!');

      const grantList: Promise<RoleResource>[] = [];

      for (let i = 0; i < grants.length; i++) {
        const resource = await this.resourceRepository.findOneBy({
          id: grants[i].resourceId,
        });
        if (!resource) continue;
        const grantData = this.roleResourceRepository.create({
          action: grants[i].action,
          role: roleData,
          resource,
        });

        const newGrant = this.roleResourceRepository.save(grantData);

        grantList.push(newGrant);
      }

      return await Promise.all(grantList);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  //roleList

  async roleList(roleId: number) {
    try {
      const resources = await this.roleRepository
        .createQueryBuilder('role')
        .where('role.deletedAt IS NULL')
        .andWhere('role.id = :roleId', { roleId })
        .leftJoin('role.roleResource', 'roleResource')
        .leftJoin('roleResource.resource', 'resource')
        .select([
          'role.name AS role',
          'resource.name AS resource',
          'roleResource.action AS action',
          'roleResource.attribute AS attributes',
        ])
        .orderBy('roleResource.createdAt', 'DESC')
        .getRawMany();

      return resources;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(error.message);
    }
  }

  async getApplicationGrantList() {
    try {
      const resources = await this.roleRepository
        .createQueryBuilder('role')
        .where('role.deletedAt IS NULL')
        .leftJoinAndSelect('role.roleResource', 'roleResource')
        .leftJoinAndSelect('roleResource.resource', 'resource')
        .select([
          'role.name AS role',
          'resource.name AS resource',
          'roleResource.action AS action',
          'roleResource.attribute AS attributes',
        ])
        .orderBy('roleResource.createdAt', 'DESC')
        .getRawMany();

      return resources;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      return await this.roleRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllRole() {
    return await this.roleRepository.findBy({
      deletedAt: null,
    });
  }
}
