import { Test, TestingModule } from '@nestjs/testing';
import { ProgramService } from './program.service'; // Adjust path accordingly
import { getRepositoryToken } from '@nestjs/typeorm';
import { Program } from '../../entities/program.entity'; // Adjust path accordingly
import { Course } from '../../entities/course.entity'; // Adjust path accordingly
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CourseService } from '../course/course.service'; // Adjust path accordingly
import { CreateProgramDto } from './dtos/create-program.dto'; // Adjust path accordingly
import { UpdateProgramDto } from './dtos/update-program.dto';

describe('ProgramService', () => {
  let service: ProgramService;
  let courseService: CourseService;
  let programRepository: any;

  const mockCourseService = {
    findOne: jest.fn(),
  };

  const mockProgramRepository = {
    create: jest.fn(), // mockResolveValue
    save: jest.fn(), // mockResolveValue
    createQueryBuilder: jest.fn().mockReturnThis(),
    delete: jest.fn(), // mockResolveValue { affected: 1 }
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(), // mockResolveValue
    getOne: jest.fn(), // mockResolveValue
    getCount: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
  };

  const mockFindMaxCode = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProgramService,
        {
          provide: getRepositoryToken(Program),
          useValue: mockProgramRepository,
        },
        {
          provide: CourseService,
          useValue: mockCourseService,
        },
      ],
    }).compile();

    service = module.get<ProgramService>(ProgramService);
    courseService = module.get<CourseService>(CourseService);
    programRepository = module.get(getRepositoryToken(Program));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('UTCID01: Should be new program data', async () => {
      const createProgramDto: CreateProgramDto = {
        title: 'Listening 900+',
        description: 'abc',
        sessionQuantity: 12,
        courseId: [1, 2],
        type: 'ielts',
      };

      // Mocking the necessary methods
      mockCourseService.findOne.mockResolvedValue({ id: 1, price: 200 });
      mockCourseService.findOne.mockResolvedValueOnce({ id: 2, price: 300 });

      mockProgramRepository.create.mockReturnValue({
        ...createProgramDto,
        code: 'PI001',
        course: [
          { id: 1, price: 200 },
          { id: 2, price: 300 },
        ],
        price: 500,
      });
      mockProgramRepository.save.mockResolvedValue({
        ...createProgramDto,
        code: 'PI001',
        course: [
          { id: 1, price: 200 },
          { id: 2, price: 300 },
        ],
        price: 500,
      });

      const result = await service.create(createProgramDto);

      expect(result.code).toBe('PI001');
      expect(result.price).toBe(500);
      expect(mockProgramRepository.save).toHaveBeenCalled();
    });

    it('UTCID02: Should be new program data', async () => {
      const createProgramDto: CreateProgramDto = {
        title: 'Listening 900+',
        description: 'abc',
        sessionQuantity: 12,
        courseId: [1, 2],
        type: 'toeic',
      };

      // Mocking the necessary methods
      mockCourseService.findOne.mockResolvedValue({ id: 1, price: 200 });
      mockCourseService.findOne.mockResolvedValueOnce({ id: 2, price: 300 });

      mockProgramRepository.create.mockReturnValue({
        ...createProgramDto,
        code: 'PT002',
        course: [
          { id: 1, price: 200 },
          { id: 2, price: 300 },
        ],
        price: 500,
      });
      mockProgramRepository.save.mockResolvedValue({
        ...createProgramDto,
        code: 'PT002',
        course: [
          { id: 1, price: 200 },
          { id: 2, price: 300 },
        ],
        price: 500,
      });

      const result = await service.create(createProgramDto);

      expect(result.code).toBe('PT002');
      expect(result.price).toBe(500);
      expect(mockProgramRepository.save).toHaveBeenCalled();
    });

    it('UTCID03: Should be new program data', async () => {
      const createProgramDto: CreateProgramDto = {
        title: 'Listening 900+',
        description: 'abc',
        sessionQuantity: 12,
        courseId: [1, 2],
        type: 'toefl',
      };

      // Mocking the necessary methods
      mockCourseService.findOne.mockResolvedValue({ id: 1, price: 200 });
      mockCourseService.findOne.mockResolvedValueOnce({ id: 2, price: 300 });

      mockProgramRepository.create.mockReturnValue({
        ...createProgramDto,
        code: 'PF003',
        course: [
          { id: 1, price: 200 },
          { id: 2, price: 300 },
        ],
        price: 500,
      });
      mockProgramRepository.save.mockResolvedValue({
        ...createProgramDto,
        code: 'PF003',
        course: [
          { id: 1, price: 200 },
          { id: 2, price: 300 },
        ],
        price: 500,
      });

      const result = await service.create(createProgramDto);

      expect(result.code).toBe('PF003');
      expect(result.price).toBe(500);
      expect(mockProgramRepository.save).toHaveBeenCalled();
    });

    it('UTCID04: Should throw NotFoundException if courseId is invalid', async () => {
      const createProgramDto: CreateProgramDto = {
        title: 'Listening 900+',
        description: 'abc',
        sessionQuantity: 12,
        courseId: [999], // Invalid courseId
        type: 'toeic',
      };

      // Mocking the necessary methods
      mockCourseService.findOne.mockResolvedValueOnce(null); // Simulate no course found with id 999

      // Testing the invalid courseId
      await expect(service.create(createProgramDto)).rejects.toThrow(
        new NotFoundException('Course information is not found'),
      );
    });
    it('UTCID05: Should throw NotFoundException if input is invalid', async () => {
      const createProgramDto: CreateProgramDto = {
        title: 'Listening 900+',
        description: 'abc',
        sessionQuantity: 12,
        courseId: [], // Invalid courseId
        type: 'toeicc',
      };
    });
  });

  describe('findAllByType', () => {
    it('UCTID01: Should return programs and total record count', async () => {
      const mockPrograms = [
        { id: 1, type: 'toeic', name: 'Test Program 1' },
        { id: 2, type: 'toeic', name: 'Test Program 2' },
      ]; // Mock the program data

      programRepository.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPrograms),
      });

      programRepository.createQueryBuilder.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2), // Mock the total record count
      });

      const result = await service.findAllByType(2, 10, 'toeic');
      expect(result).toEqual({
        totalRecord: 2,
        programs: mockPrograms,
      });
    });

    it('UCTID02: Should return programs and total record count', async () => {
      const mockPrograms = [
        { id: 1, type: 'ielts', name: 'Test Program 1' },
        { id: 2, type: 'ielts', name: 'Test Program 2' },
      ]; // Mock the program data

      programRepository.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockPrograms),
      });

      programRepository.createQueryBuilder.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2), // Mock the total record count
      });

      const result = await service.findAllByType(2, 10, 'ielts');
      expect(result).toEqual({
        totalRecord: 2,
        programs: mockPrograms,
      });
    });

    it('UCTID03: Should throw NotFoundException when no programs are found', async () => {
      programRepository.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]), // No programs found
      });

      programRepository.createQueryBuilder.mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0), // No count
      });

      await expect(service.findAllByType(2, 10, 'ielts')).rejects.toThrow(
        new NotFoundException('Program not found'),
      );
    });

    it('UTCID04: Should throw InternalServerErrorException when an error occurs', async () => {
      programRepository.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockRejectedValue(new Error('Invalid Input')), // Simulating an error
      });

      await expect(service.findAllByType(-2, 10, 'toefl')).rejects.toThrow(
        new InternalServerErrorException('Invalid Input'),
      );
    });

    it('UTCID05: Should throw NotFoundException when an error occurs', async () => {
      programRepository.createQueryBuilder.mockReturnValueOnce({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest
          .fn()
          .mockRejectedValue(new NotFoundException('Program not found')), // Simulating an error
      });

      await expect(service.findAllByType(-2, 10, 'toefl')).rejects.toThrow(
        new NotFoundException('Program not found'),
      );
    });
  });

  describe('findOne', () => {
    it('UTCID01: Should return the program if found', async () => {
      const mockProgram = { id: 1, type: 'toeic', name: 'Test Program' };

      programRepository.findOneBy.mockResolvedValue(mockProgram); // Simulating a successful fetch

      const result = await service.findOne(1);
      expect(result).toEqual(mockProgram);
    });

    it('UTCID02: Should throw NotFoundException when program is not found', async () => {
      programRepository.findOneBy.mockResolvedValue(null); // Simulating no program found

      await expect(service.findOne(1)).rejects.toThrow(
        new NotFoundException('Program not found'),
      );
    });

    it('UTCID03: Should throw InternalServerErrorException when an error occurs', async () => {
      const errorMessage = 'Invalid Input';
      programRepository.findOneBy.mockRejectedValue(new Error(errorMessage)); // Simulating an error

      await expect(service.findOne(-1)).rejects.toThrow(
        new InternalServerErrorException(errorMessage),
      );
    });

    it('UTCID04: Should throw NotFoundException when program is not found', async () => {
      programRepository.findOneBy.mockResolvedValue(null); // Simulating no program found

      await expect(service.findOne(9999)).rejects.toThrow(
        new NotFoundException('Program not found'),
      );
    });
  });

  describe('update', () => {
    it('UTCID01: Should successfully update program and return the updated program', async () => {
      const updateProgramDto: UpdateProgramDto = {
        courseId: [1, 2],
        title: 'Listening 900+',
        description: 'abc',
        sessionQuantity: 12,
        type: 'toeic',
      };

      const mockProgram = {
        id: 1,
        name: 'Test Program',
        price: 0,
        course: [],
      }; // Mock existing program

      const mockCourses = [
        { id: 1, price: 100 },
        { id: 2, price: 150 },
      ]; // Mock courses

      // Mock `programRepository.findOneBy` to return the mock program
      programRepository.findOneBy.mockResolvedValue(mockProgram);

      // Mock `courseService.findOne` to return the mock courses
      mockCourseService.findOne.mockResolvedValueOnce(mockCourses[0]); // For course 1
      mockCourseService.findOne.mockResolvedValueOnce(mockCourses[1]); // For course 2

      // Expected updated program after update
      const updatedProgram = {
        ...mockProgram,
        ...updateProgramDto,
        price: 250, // Total price of courses 1 and 2
        course: mockCourses,
      };

      // Mock `programRepository.save` to return the updated program
      programRepository.save.mockResolvedValue(updatedProgram);

      // Call the `update` method
      const result = await service.update(1, updateProgramDto);

      // Verify the result and assert that the correct program is returned
      expect(result).toEqual(updatedProgram);
    });

    it('UTCID02: Should successfully update program and return the updated program', async () => {
      const updateProgramDto: UpdateProgramDto = {
        courseId: [1, 2],
        title: 'Listening 900+',
        description: 'abc',
        sessionQuantity: 12,
        type: 'toeic',
      };

      const mockProgram = {
        id: 1,
        name: 'Test Program',
        price: 0,
        course: [],
      }; // Mock existing program

      const mockCourses = []; // Mock courses

      // Mock `programRepository.findOneBy` to return the mock program
      programRepository.findOneBy.mockResolvedValue(mockProgram);

      // Mock `courseService.findOne` to return the mock courses

      // Expected updated program after update
      const updatedProgram = {
        ...mockProgram,
        ...updateProgramDto,
        price: 250, // Total price of courses 1 and 2
        course: mockCourses,
      };

      // Mock `programRepository.save` to return the updated program
      programRepository.save.mockResolvedValue(updatedProgram);

      // Call the `update` method
      const result = await service.update(1, updateProgramDto);

      // Verify the result and assert that the correct program is returned
      expect(result).toEqual(updatedProgram);
    });

    it('UTCID03: Should throw NotFoundException when course is not found', async () => {
      const updateProgramDto: UpdateProgramDto = { courseId: [1, 2] };

      // Simulate that the program exists
      programRepository.findOne.mockResolvedValue({
        id: 1,
        name: 'Test Program',
      });

      // Simulate that the first course exists, but the second does not
      mockCourseService.findOne.mockResolvedValueOnce({ id: 1, price: 100 });
      mockCourseService.findOne.mockResolvedValueOnce(null); // Second course not found

      await expect(service.update(1, updateProgramDto)).rejects.toThrow(
        new NotFoundException('Course information is not found'),
      );
    });

    it('UTCID04: Should throw NotFoundException when program is not found', async () => {
      const updateProgramDto: UpdateProgramDto = { courseId: [1, 2] };

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(1, updateProgramDto)).rejects.toThrow(
        new NotFoundException('Program not found'),
      );
    });
  });

  describe('remove', () => {
    it('UTCID01: Should successfully remove the program and return the updated program', async () => {
      const mockProgram: Program = {
        id: 1,
        code: 'PRG123',
        title: 'Test Program',
        description: 'Test Program Description',
        sessionQuantity: 10,
        type: 'toeic',
        target_start: 2023,
        target_end: 2024,
        isActive: true,
        deletedAt: null, // Initially null
        price: 100,
        course: [], // Optional mock courses, not needed for this test case
        userProgram: [],
        avatar: 'avatar.jpg',
        payment: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }; // Mock program to be removed

      const updatedProgram = {
        ...mockProgram,
        deletedAt: expect.any(Date), // `deletedAt` should be set to a new date
        isActive: false, // `isActive` should be set to false
      };

      // Mock the `findOne` to return the mock program
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProgram);

      // Mock the `programRepository.save` to return the updated program
      programRepository.save.mockResolvedValue(updatedProgram);

      // Call the remove function
      const result = await service.remove(1);

      // Verify that the result is the updated program
      expect(result).toEqual(updatedProgram);
      expect(programRepository.save).toHaveBeenCalledWith(updatedProgram); // Ensure `save` was called with the updated program
    });

    it('UTCID02: Should throw invalid input', async () => {
      // Mock the `findOne` to return null (program not found)
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(-1)).rejects.toThrow(
        new BadRequestException('Invalid input'),
      );
    });

    it('UTCID03: Should throw NotFoundException when the program is not found', async () => {
      // Mock the `findOne` to return null (program not found)
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(
        new NotFoundException('Program not found'),
      );
    });

    // it('should throw InternalServerErrorException when an unexpected error occurs', async () => {
    //   const errorMessage = 'Unexpected error occurred';

    //   // Mock the `findOne` to return a mock program
    //   jest.spyOn(service, 'findOne').mockResolvedValue({
    //     id: 1,
    //     title: 'Test Program',
    //     description: 'Test Program Description',
    //     price: 100,
    //     isActive: true,
    //     deletedAt: null,
    //   });

    //   // Simulate an unexpected error when saving the program
    //   programRepository.save.mockRejectedValue(new Error(errorMessage));

    //   await expect(service.remove(1)).rejects.toThrowError(
    //     new InternalServerErrorException(errorMessage),
    //   );
    // });
  });
});
