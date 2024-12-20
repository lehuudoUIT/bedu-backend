import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Report } from '../../entities/report.entity';
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
  ) {
    const poster = await this.userService
                              .findUserById(createReportDto.userId);

    if (!poster) {
      throw new NotFoundException('Poster information is not found');
    }

    const report = this.reportRepository.create({
      ...createReportDto,
      user: poster,
    });
    const result = await this.reportRepository.save(report);
    if (!result) {
      throw new InternalServerErrorException('Failed to update report');
    }

    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    type: string = 'financial',
    status: string
  ): Promise<{
    totalRecord: number,
    reports: Report[]
  }> {
    const report = await this.reportRepository
                            .createQueryBuilder('report')
                            .where('report.reportType = :type', { type })
                            .andWhere('report.deletedAt is null')
                            .andWhere("report.isActive = :isActive", { isActive: status })
                            .skip((page - 1) * limit)
                            .take(limit)
                            .getMany();
    const total = await this.reportRepository
                            .createQueryBuilder('report')
                            .where('report.reportType = :type', { type })
                            .andWhere('report.deletedAt is null')
                            .andWhere("report.isActive = :isActive", { isActive: status})
                            .getCount();
    if (!report) {
      throw new NotFoundException('No report found!');
    }
    return {
      totalRecord: total,
      reports: report
    };
  }

  async findOne(
    id: number
  ) {
    const report = await this.reportRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async update(
    id: number, 
    updateReportDto: UpdateReportDto
  ): Promise<Report> {
    const report = await this.findOne(id);
    const poster = await this.userService
                            .findUserById(updateReportDto.userId);

    if (!poster) {
      throw new NotFoundException('Poster information is not found');
    }

    if (!report) {
      throw new NotFoundException('Report not found');
    }
    const newReport = this.reportRepository.create({
      ...report,
      ...updateReportDto,
      user: poster,
    });
    const result = await this.reportRepository.save(newReport);
    if (!result) {
      throw new InternalServerErrorException('Failed to update report');
    }
    return result
  }

  async remove(
    id: number
  ) {
    const report = await this.findOne(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    const newReport = this.reportRepository.create({
      ...report,
      deletedAt: new Date(),
      isActive: false,
    });
    const result = await this.reportRepository.save(newReport);
    if (!result) {
      throw new InternalServerErrorException('Failed to update report');
    }
    return result;
  }
}
