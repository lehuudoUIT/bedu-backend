import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Score } from 'src/entities/score.entity';
import { UsersModule } from '../users/users.module';
import { ExamModule } from '../exam/exam.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Score]),
    UsersModule,
    ExamModule,
  ],
  controllers: [ScoreController],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
