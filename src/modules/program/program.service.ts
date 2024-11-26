import { Injectable } from '@nestjs/common';
import { CreateProgramDto } from './dtos/create-program.dto';
import { UpdateProgramDto } from './dtos/update-program.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Program } from 'src/entities/program.entity';
import { ResponseDto } from './common/response.interface';

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
  ) {}

  async create(
    createProgramDto: CreateProgramDto
  ): Promise<ResponseDto> {
    try {
      const program = this.programRepository.create(createProgramDto);
      if (!program) {
        return {
          statusCode: 500,
          message: 'Failed to create new program entity'
        }
      }
      const result = await this.programRepository.save(program);
      return {
        statusCode: 201,
        message: 'Create program successfully',
        data: result,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to create program'
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    type: string = 'toeic'
  ): Promise<ResponseDto> {
    try {
      const programs = await this.programRepository
                              .createQueryBuilder('program')
                              .where('program.type = :type', { type })
                              .andWhere('program.isActive = true')
                              .andWhere('program.deletedAt IS NULL')
                              .skip((page - 1) * limit)
                              .take(limit)
                              .getMany();
      return {
        statusCode: 200,
        message: 'Get all programs successfully',
        data: programs,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to get all programs',
        data: null
      }
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    try {
      const program = await this.programRepository.findOneBy({
        id,
        isActive: true,
        deletedAt: null
      });
      if (!program) {
        return {
          statusCode: 404,
          message: 'Program not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get program by id successfully',
        data: program,
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateProgramDto: UpdateProgramDto
  ): Promise<ResponseDto> {
    try {
      const programResponse = await this.findOne(id);
      if (programResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Program not found',
          data: null
        }
      }
      const program = Array.isArray(programResponse.data) 
                      ? programResponse.data[0] 
                      : programResponse.data;
      const newProgram = { ...program, ...updateProgramDto };
      const updatedProgram = await this.programRepository
                                    .save(newProgram);
      
      return {
        statusCode: 200,
        message: 'Update program successfully',
        data: updatedProgram,
      }

    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update program',
        data: null
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const programResponse = await this.findOne(id);
      if (programResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: 'Program not found',
          data: null
        }
      }
      const program = Array.isArray(programResponse.data) 
                      ? programResponse.data[0] 
                      : programResponse.data;
      program.deletedAt = new Date();
      program.isActive = false;
      const result = await this.programRepository.save(program);
      return {
        statusCode: 200,
        message: 'Delete program successfully',
        data: result
      }

    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete program',
        data: null
      }
    }
  }
}
