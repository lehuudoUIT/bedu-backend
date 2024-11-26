import { Module } from '@nestjs/common';
import { UserProgramService } from './user_program.service';
import { UserProgramController } from './user_program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgram } from 'src/entities/user_program.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProgram])
  ],
  controllers: [UserProgramController],
  providers: [UserProgramService],
})
export class UserProgramModule {}
