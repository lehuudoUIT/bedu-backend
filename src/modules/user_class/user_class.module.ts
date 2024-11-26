import { Module } from '@nestjs/common';
import { UserClassService } from './user_class.service';
import { UserClassController } from './user_class.controller';
import { UserClass } from 'src/entities/user_class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserClass])],
  controllers: [UserClassController],
  providers: [UserClassService],
})
export class UserClassModule {}
