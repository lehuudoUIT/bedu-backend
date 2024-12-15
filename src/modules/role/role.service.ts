import {Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';

@Injectable()
export class RoleService {

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const newRole = await this.roleRepository.create(createRoleDto);
      return await this.roleRepository.save(newRole);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(): Promise<Role[]> {
    try {
      return await this.roleRepository
                      .createQueryBuilder('role')
                      .where('role.deletedAt IS NULL')
                      .getMany();
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: number): Promise<Role> {
    try {
      const role =  await this.roleRepository
                      .createQueryBuilder('roles')
                      .where('roles.id = :id', { id })
                      .andWhere('roles.deletedAt IS NULL')
                      .getOne();
      return role;
    } catch (error) {
      throw new Error(error);
    }
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository
                            .createQueryBuilder('role')
                            .where('role.id = :id', { id })
                            .andWhere('role.deletedAt IS NULL')
                            .getOne();
      if (!role) {
        throw new Error("Role not found");
      }
      role.deletedAt = new Date();
      return await this.roleRepository.save(role);
    } catch (error) {
      throw new Error(error);
    }
  }
}
