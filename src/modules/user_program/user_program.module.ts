import { Module } from '@nestjs/common';
import { UserProgramService } from './user_program.service';
import { UserProgramController } from './user_program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProgram } from 'src/entities/user_program.entity';
import { UsersModule } from '../users/users.module';
import { ProgramModule } from '../program/program.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProgram]),
    UsersModule,
    ProgramModule
  ],
  controllers: [UserProgramController],
  providers: [UserProgramService],
  exports: [UserProgramService]
})
export class UserProgramModule {}
