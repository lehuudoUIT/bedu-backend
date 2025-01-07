import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { UsersModule } from '../users/users.module';
import { ProgramModule } from '../program/program.module';
import { ClassModule } from '../class/class.module';
import { PaymentFactory } from './payment.factory';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { CacheModule } from '../cache/cache.module';
import { UserProgramModule } from '../user_program/user_program.module';
import { UserClassModule } from '../user_class/user_class.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    UsersModule,
    ProgramModule,
    ClassModule,
    PaymentMethodModule,
    UserProgramModule,
    UserClassModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentFactory],
  exports: [PaymentService],
})
export class PaymentModule {}
