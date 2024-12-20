import { Module } from '@nestjs/common';
import { UserClassService } from './user_class.service';
import { UserClassController } from './user_class.controller';
import { UserClass } from 'src/entities/user_class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ClassModule } from '../class/class.module';
import { GoogleModule } from '../google/google.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserClass]),
    UsersModule,
    ClassModule,
    GoogleModule,
  ],
  controllers: [UserClassController],
  providers: [UserClassService],
})
export class UserClassModule {}
