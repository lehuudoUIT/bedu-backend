import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { Report } from 'src/entities/report.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Report])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
