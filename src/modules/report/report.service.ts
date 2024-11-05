import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from 'src/entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto) {
    return await this.reportRepository.insert(createReportDto);
  }

  async findAll() {
    return await this.reportRepository.find();
  }

  async findOne(id: number) {
    return await this.reportRepository.findOneBy({ id });
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    return await this.reportRepository.update({ id }, updateReportDto);
  }

  async remove(id: number) {
    return await this.reportRepository.delete({ id });
  }
}
