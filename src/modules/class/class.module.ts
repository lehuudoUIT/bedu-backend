import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { Class } from 'src/entities/class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
