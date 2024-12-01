import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { ProgramService } from '../program/program.service';
import { ClassService } from '../class/class.service';
import { ResponseDto } from './common/response.interface';

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
  ): Promise<ResponseDto> {
    try {
      const userResponse = await this.userService.findUserById(createPaymentDto.userId);
      const user = Array.isArray(userResponse.data)
                    ? userResponse.data[0]
                    : userResponse.data;

      const programResponse = await this.programService.findOne(createPaymentDto.programId);
      if (programResponse.statusCode !== 200) {
        return {
          statusCode: 200,
          message: "Failed to create payment information because program is not found",
          data: null
        }
      }
      const program = Array.isArray(programResponse.data)
                      ? programResponse.data[0]
                      : programResponse.data;

      const classResponse = await this.classService.findOne(createPaymentDto.classId);
      const classData = Array.isArray(classResponse.data)
                        ? classResponse.data[0]
                        : classResponse.data;

      if (classResponse.statusCode !== 200 && programResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Program or class information is not found",
          data: null
        }
      }
      const payment = this.paymentRepository.create({
        ...createPaymentDto,
        user: user,
        program: program,
        class: classData
      });

      const result = await this.paymentRepository.save(payment);
      return {
        statusCode: 201,
        message: "Create payment information successfully",
        data: result
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Failed to create payment information",
        data: null
      }
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ) {
    try {
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
      return {
        statusCode: 404,
        message: "Payments not found",
        data: null
      }
    }
    return {
      statusCode: 200,
      message: "Retrieve payments information successfully",
      data: payments
      }
    }catch (error) {
      return {
        statusCode: 500,
        message: error.message,
        data: null
      }
    }
  }

  async findOne(
    id: number
  ): Promise<ResponseDto> {
    try {
      const payment = await this.paymentRepository.findOneBy({
        id,
        deletedAt: null, 
        isActive: true
      })
      if (!payment) {
        return {
          statusCode: 404,
          message: "Payment information not found",
          data: null
        }
      }
      return {
        statusCode: 200,
        message: "Retrieve payment information successfully",
        data: payment
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: "Failed to retrieve payment information",
        data: null
      }
    }
  }

  async update(
    id: number, 
    updatePaymentDto: UpdatePaymentDto
  ): Promise<ResponseDto> {
    try {
      const paymentResponse = await this.findOne(id);
      if (paymentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Payment information not found",
          data: null
        }
      }
      const payment = Array.isArray(paymentResponse.data) 
                      ? paymentResponse.data[0]
                      : paymentResponse.data; 
      
      const { userId, programId, classId } = updatePaymentDto;

      const userResponse = await this.userService.findUserById(userId);
      if (userResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "User not found",
          data: null
        }
      }
      const user = Array.isArray(userResponse.data)
                    ? userResponse.data[0]
                    : userResponse.data;
      
      const programResponse = await this.programService.findOne(programId);
      const program = Array.isArray(programResponse.data)
                      ? programResponse.data[0]
                      : programResponse.data;
      
      const classResponse = await this.classService.findOne(classId);
      if (classResponse.statusCode !== 200 && programResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Program or class information is not found",
          data: null
        }
      }
      const classData = Array.isArray(classResponse.data)
                        ? classResponse.data[0]
                        : classResponse.data;

      const newPayment = this.paymentRepository.create({
        ...payment,
        ...updatePaymentDto,
        user: user,
        program: program,
        class: classData
      });
      const result = await this.paymentRepository.save(newPayment);
      return {
        statusCode: 200,
        message: "Update payment information successfully",
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: "Failed to update payment information",
        data: null
      }
    }
  }

  async remove(
    id: number
  ): Promise<ResponseDto> {
    try {
      const paymentResponse = await this.findOne(id);
      if (paymentResponse.statusCode !== 200) {
        return {
          statusCode: 404,
          message: "Payment information not found",
          data: null
        }
      }
      const payment = Array.isArray(paymentResponse.data)
                      ? paymentResponse.data[0]
                      : paymentResponse.data;
      payment.isActive = false;
      payment.deletedAt = new Date();
      const result = await this.paymentRepository.save(payment);
      return {
        statusCode: 200,
        message: "Delete payment information successfully",
        data: result
      }
    } catch(error) {
      return {
        statusCode: 500,
        message: "Failed to delete payment information",
        data: null
      }
    }
  }
}
