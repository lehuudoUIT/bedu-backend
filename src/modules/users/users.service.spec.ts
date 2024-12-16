import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { RoleService } from '../role/role.service';

describe('UsersService', () => {
  let service: UsersService;
  let roleService: RoleService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    delete: jest.fn(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockRoleService = {
    // findOne: jest.fn().mockResolvedValue({ id: 1, name: 'student' }),
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        },
        {
          provide: RoleService,
          useValue: mockRoleService
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findAllUserByGroup', () => {
    it('should return a list of users for group = student', async () => {
      // Mock dữ liệu trả về
      const mockUsers = [
        { id: 1, username: 'student1', group: { id: 1 }, isActive: true },
        { id: 2, username: 'student2', group: { id: 1 }, isActive: true },
      ];
      mockUserRepository.getMany.mockResolvedValue(mockUsers);

      const result = await service.findAllUserByGroup(1, 10, 'student');
      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw an error for invalid group', async () => {
      await expect(service.findAllUserByGroup(1, 10, 'invalid')).rejects.toThrow(
        'Invalid group',
      );
    });

    it('should throw an error when no users are found', async () => {
      mockUserRepository.getMany.mockResolvedValue([]);

      await expect(service.findAllUserByGroup(1, 10, 'student')).rejects.toThrow(
        'No user found',
      );
    });

    it('should handle pagination correctly', async () => {
      const mockUsers = [
        { id: 3, username: 'student3', group: { id: 1 }, isActive: true },
      ];
      mockUserRepository.getMany.mockResolvedValue(mockUsers);

      const result = await service.findAllUserByGroup(2, 10, 'student');
      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.skip).toHaveBeenCalledWith(10); // page 2, limit 10
    });

    it('should handle group = teacher', async () => {
      const mockUsers = [
        { id: 4, username: 'teacher1', group: { id: 2 }, isActive: true },
      ];
      mockUserRepository.getMany.mockResolvedValue(mockUsers);

      const result = await service.findAllUserByGroup(1, 10, 'teacher');
      expect(result).toEqual(mockUsers);
    });

    it('should handle group = admin', async () => {
      const mockUsers = [
        { id: 5, username: 'admin1', group: { id: 3 }, isActive: true },
      ];
      mockUserRepository.getMany.mockResolvedValue(mockUsers);

      const result = await service.findAllUserByGroup(1, 10, 'admin');
      expect(result).toEqual(mockUsers);
    });
  })

  describe('createUser', () => {
    
  })
});
