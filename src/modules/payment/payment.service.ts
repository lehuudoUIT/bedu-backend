import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Not, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProgramService } from '../program/program.service';
import { ClassService } from '../class/class.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly userService: UsersService,
    private readonly programService: ProgramService,
    private readonly classService: ClassService,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto
  ) {
    const user = await this.userService.findUserById(createPaymentDto.userId);
    if(!user) {
      throw new NotFoundException('User information is not found');
    }

    const program = await this.programService.findOne(createPaymentDto.programId);
    if (!program) {
      throw new NotFoundException('Program information is not found');
    }

    const classData = await this.classService.findOne(createPaymentDto.classId);

    if (!classData && !program) {
      throw new NotFoundException('Program or class information is not found');
    }
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      user: user,
      program: program,
      class: classData
    });

    const result = await this.paymentRepository.save(payment);
    return result;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ) {
    const payments = await this.paymentRepository
                        .createQueryBuilder('payment')
                        .leftJoinAndSelect('payment.user', 'user')
                        .leftJoinAndSelect('payment.program', 'program')
                        .leftJoinAndSelect('payment.class', 'class')
                        .where('payment.deletedAt IS NULL')
                        .where('payment.isActive = true')
                        .orderBy('payment.createdAt', 'DESC')
                        .skip((page - 1) * limit)
                        .take(limit)
                        .getMany();
    if (payments.length === 0) {
      throw new NotFoundException('No payment found!');
    }
    return payments;
  }

  async findOne(
    id: number
  ) {
    const payment = await this.paymentRepository.findOneBy({
      id,
      deletedAt: null, 
      isActive: true
    })
    if (!payment) {
      throw new NotFoundException('Payment information not found');
    }
    return payment;
  }

  async update(
    id: number, 
    updatePaymentDto: UpdatePaymentDto
  ) {
    const payment = await this.findOne(id);
    if (!payment) {
      throw new NotFoundException('Payment information not found');
    }
    
    const { userId, programId, classId } = updatePaymentDto;

    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new  NotFoundException('User information is not found');
    }
    
    const program = await this.programService.findOne(programId);
    
    const classData = await this.classService.findOne(classId);
    if (!classData && !program) {
      throw new  NotFoundException('Program or class information');
    }

    const newPayment = this.paymentRepository.create({
      ...payment,
      ...updatePaymentDto,
      user: user,
      program: program,
      class: classData
    });
    const result = await this.paymentRepository.save(newPayment);
    return result;
  }

  async remove(
    id: number
  ) {
    const payment = await this.findOne(id);
    if (!payment) {
      throw new NotFoundException('Payment information not found');
    }

    payment.isActive = false;
    payment.deletedAt = new Date();
    const result = await this.paymentRepository.save(payment);
    return result
  }
}
