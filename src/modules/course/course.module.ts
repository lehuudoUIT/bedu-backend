import { ProgramService } from './../program/program.service';
import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/entities/course.entity';
import { ProgramModule } from '../program/program.module';
import { Program } from 'src/entities/program.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    forwardRef(() => ProgramModule),
],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService]
})
export class CourseModule {}
