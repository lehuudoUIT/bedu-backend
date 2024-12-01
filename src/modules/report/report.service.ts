import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Report } from 'src/entities/report.entity';
import { ResponseDto } from './common/response.interface';
import {UsersService} from "../users/users.service"

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    private readonly userService: UsersService
  ) {}

  async create(
    createReportDto: CreateReportDto
  ): Promise<ResponseDto> {
    try {
      const posterResponse = await this.userService
                              .findUserById(createReportDto.userId);
      const poster = Array.isArray(posterResponse.data)
                      ? posterResponse.data[0]
                      : posterResponse.data;  
      if (!poster) {
        return {
          statusCode: 404,
          message: 'Poster information is not found',
          data: null
        }
      }

      const report = this.reportRepository.create({
        ...createReportDto,
        user: poster,
      });
      const result = await this.reportRepository.save(report);

      return {
        statusCode: 201,
        message: 'Create report successfully',
        data: result
      }

    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    type: string = 'financial'
  ): Promise<ResponseDto> {
    try {
        const report = await this.reportRepository
                            .createQueryBuilder('report')
                            .where('report.type = :type', { type })
                            .andWhere('report.deletedAt is null')
                            .andWhere("report.isActive = :isActive", { isActive: 1 })
                            .skip((page - 1) * limit)
                            .take(limit)
                            .getMany();
        if (!report) {
          return {
            statusCode: 404,
            message: 'Report not found',
            data: null
          }
        }
        return {
          statusCode: 200,
          message: 'Get report successfully',
          data: report,
        }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findOne(
    id: number
  ): Promise<ResponseDto> {
    try {
      const report = await this.reportRepository.findOneBy({
        id,
        isActive: true,
        deletedAt: IsNull(),
      });
      if (!report) {
        return {
          statusCode: 404,
          message: 'Report not found',
          data: null
        }
      }
      return {
        statusCode: 200,
        message: 'Get report successfully',
        data: report,
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async update(
    id: number, 
    updateReportDto: UpdateReportDto
  ): Promise<ResponseDto> {
    const reportResponse = await this.findOne(id);
    const report = Array.isArray(reportResponse.data)
                  ? reportResponse.data[0]
                  : reportResponse.data;
    const posterResponse = await this.userService
                            .findUserById(updateReportDto.userId);
    const poster = Array.isArray(posterResponse.data)
                  ? posterResponse.data[0]
                  : posterResponse.data;
    if (!poster) {
      return {
        statusCode: 404,
        message: 'Poster information is not found',
        data: null
      }
    }

    if (!report) {
      return {
        statusCode: 404,
        message: 'Report not found',
        data: null
      }
    }
    try {
      const newReport = this.reportRepository.create({
        ...report,
        ...updateReportDto,
        user: poster,
      });
      const result = await this.reportRepository.save(newReport);
      return {
        statusCode: 200,
        message: 'Update report successfully',
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const reportResponse = await this.findOne(id);
      const report = Array.isArray(reportResponse.data)
                    ? reportResponse.data[0]
                    : reportResponse.data;
      if (!report) {
        return {
          statusCode: 404,
          message: 'Report not found',
          data: null
        }
      }
      const newReport = this.reportRepository.create({
        ...report,
        deletedAt: new Date(),
        isActive: false,
      });
      const result = await this.reportRepository.save(newReport);
      return {
        statusCode: 200,
        message: 'Delete report successfully',
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }
}
