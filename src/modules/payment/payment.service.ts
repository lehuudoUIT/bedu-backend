import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    return await this.paymentRepository.insert(createPaymentDto);
  }

  async findAll() {
    return await this.paymentRepository.find();
  }

  async findOne(id: number) {
    return await this.paymentRepository.findOneBy({ id });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return await this.paymentRepository.update({ id }, updatePaymentDto);
  }

  async remove(id: number) {
    return await this.paymentRepository.delete({ id });
  }
}
