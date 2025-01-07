import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';
import { Not, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProgramService } from '../program/program.service';
import { ClassService } from '../class/class.service';
import { formData } from 'src/utils';

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

    let program = null;
    let classData = null;

    if (createPaymentDto.programId) {
      program = await this.programService.findOne(createPaymentDto.programId);
      if (!program) {
        throw new NotFoundException('Program information is not found');
      }
    }

    if (createPaymentDto.classId) {
      classData = await this.classService.findOne(createPaymentDto.classId);
      if (!classData) {
        throw new NotFoundException('Class information is not found');
      }
    }

    if (!program && !classData) {
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
  ): Promise<{
    totalRecord: number,
    payments: Payment[]
  }> {
    const payments = await this.paymentRepository
                        .createQueryBuilder('payment')
                        .leftJoinAndSelect('payment.user', 'user')
                        .leftJoinAndSelect('payment.program', 'program')
                        .leftJoinAndSelect('payment.class', 'class')
                        .where('payment.deletedAt IS NULL')
                       // .where('payment.isActive := isActive', { isActive: status })  
                        .orderBy('payment.createdAt', 'DESC')
                        .skip((page - 1) * limit)
                        .take(limit)
                        .getMany();
    const total = await this.paymentRepository
                        .createQueryBuilder('payment')
                        .where('payment.deletedAt IS NULL')
                        //.where('payment.isActive := isActive', { isActive: status })
                        .getCount();
    if (payments.length === 0) {
      throw new NotFoundException('No payment found!');
    }
    return {
      totalRecord: total,
      payments: payments
    };
  }

  async findOne(
    id: number
  ) {
    const payment = await this.paymentRepository.findOneBy({
      id,
      deletedAt: null, 
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
    
    let program = null;
    let classData = null;

    if (programId) {
      program = await this.programService.findOne(programId);
      if (!program) {
        throw new NotFoundException('Program information is not found');
      }
    }

    if (classId) {
      classData = await this.classService.findOne(classId);
      if (!classData) {
        throw new NotFoundException('Class information is not found');
      }
    }

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

  async exportRevenueReportToExcelFile(
    startTime: Date,
    endTime: Date,
    type: string
  ) {
    const payments = await this.searchPayment(startTime, endTime, type);
    if (payments.length === 0) {
      throw new NotFoundException('No payment found!');
    }

    let paymentToExcel: formData[] = [];
    for (let i: number = 0; i < payments.length; i++) {
      if (payments[i].program == null) {
        let data: formData = {} as formData;
        data['No'] = i + 1;
        data['ProgramName'] = payments[i].class.name;
        data['Payer'] = payments[i].user.name;
        data['Amount'] = payments[i].amount;
        data['Method'] = payments[i].method;
        data['TransactionId'] = payments[i].transactionId;
        data['Status'] = "Paid";
        paymentToExcel.push(data);
      } else {
        let data: formData = {} as formData;
        data['No'] = i + 1;
        data['ProgramName'] = payments[i].program.title;
        data['Payer'] = payments[i].user.name;
        data['Amount'] = payments[i].amount;
        data['Method'] = payments[i].method;
        data['TransactionId'] = payments[i].transactionId;
        data['Status'] = "Paid";
        paymentToExcel.push(data);
      }
    }
    return paymentToExcel;
  }

  async searchPayment(
    startTime: Date,
    endTime: Date,
    type: string // type of program,
  ): Promise<Payment[]> {
    console.log("Start time: ", startTime);
    console.log("End time: ", endTime);
    console.log("Type: ", type);
    let payments_program=[], payments_class=[];
    if (type == 'all') {
      payments_program = await this.paymentRepository
                        .createQueryBuilder('payment')
                        .leftJoinAndSelect('payment.user', 'user')
                        .leftJoinAndSelect('payment.program', 'program')
                        .leftJoinAndSelect('payment.class', 'class')
                        .where('payment.createdAt >= :startTime', { startTime })
                        .andWhere('payment.createdAt <= :endTime', { endTime })
                        .andWhere('payment.deletedAt IS NULL')
                        .getMany();
    } else {
      payments_program = await this.paymentRepository
                        .createQueryBuilder('payment')
                        .leftJoinAndSelect('payment.user', 'user')
                        .leftJoinAndSelect('payment.program', 'program')
                        .leftJoinAndSelect('payment.class', 'class')
                        .where('payment.createdAt >= :startTime', { startTime })
                        .andWhere('payment.createdAt <= :endTime', { endTime })
                        .andWhere('payment.deletedAt IS NULL')
                        .andWhere('payment.classId IS NULL')
                        .andWhere('program.type = :type', { type })
                        .getMany();
      payments_class = await this.paymentRepository
                        .createQueryBuilder('payment')
                        .leftJoinAndSelect('payment.user', 'user')
                        .leftJoinAndSelect('payment.program', 'program')
                        .leftJoinAndSelect('payment.class', 'class')
                        .where('payment.createdAt >= :startTime', { startTime })
                        .andWhere('payment.createdAt <= :endTime', { endTime })
                        .andWhere('payment.deletedAt IS NULL')
                        .andWhere('payment.programId IS NULL')
                        .andWhere('class.type = :type', { type })
                        .getMany();
    }
    const payments = [...payments_program, ...payments_class];
    if (payments.length === 0) {
      throw new NotFoundException('No payment found!');
    }
    return payments
  }

  async totalRevenue(
    startTime: Date,
    endTime: Date,
    type: string
  ) {
    const monthlyRevenue = {};
    const payments = await this.searchPayment(startTime, endTime, type);

    payments.forEach((payment) => {
      const createdAt = new Date(payment.createdAt);
      const year = createdAt.getFullYear();
      const month = createdAt.getMonth() + 1; 
  
      const key = `${year}-${month}`;

      if (!monthlyRevenue[key]) {
        monthlyRevenue[key] = 0;
      }
  
      monthlyRevenue[key] += payment.amount;
    });
    return monthlyRevenue;
  }
}
