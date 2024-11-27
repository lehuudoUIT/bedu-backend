import { forwardRef, Module } from '@nestjs/common';
import { ProgramService } from './program.service';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Program } from 'src/entities/program.entity';
import { CourseModule } from '../course/course.module';
import { CourseService } from '../course/course.service';
import { Course } from 'src/entities/course.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Program]),
    CourseModule,
],
  controllers: [ProgramController],
  providers: [ProgramService],
  exports: [ProgramService],
})
export class ProgramModule {}
