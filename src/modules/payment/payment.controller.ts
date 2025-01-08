import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseFilters,
  UseInterceptors,
  UseGuards,
  Res,
  Req,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';
import { Request, Response } from 'express';
import { UserProgramService } from '../user_program/user_program.service';
import { UserClassService } from '../user_class/user_class.service';

@Controller('payments')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userProgramService: UserProgramService,
    private readonly userClassService: UserClassService,
  ) {}

  @Post('process')
  async processPayment(
    @Body() body: { method: string; amount: number; content: string },
  ) {
    const { method, amount, content } = body;

    return {
      messsage: 'Process payment successfully!',
      metadata: await this.paymentService.processPayment(
        method,
        amount,
        content,
      ),
    };
  }

  @Post('confirm-zalo')
  async confirmPaymentZalo(
    @Body() body: { data: string; mac: string },
    @Res() res: Response,
  ) {
    console.log('Zalo gọi callback r nè brou');

    const response = await this.paymentService.confirmPayment('zalopay', body);

    return {
      skipFormatResponse: true,
      ...response,
    };
  }

  @Get('confirm-paypal')
  async confirmPaymentPaypal(@Req() req: Request, @Res() res: Response) {
    const token = req.query.token;
    console.log('req.token: ', token);

    const response = await this.paymentService.confirmPayment('paypal', token);

    if (response.status === 'COMPLETED') {
      const [userId, keyword, id] =
        response.purchase_units[0]?.items[0]?.name?.split('-');

      console.log({ userId, keyword, id });
      const amount = response.purchase_units[0]?.amount?.value || 0;

      //* Add course or class to student
      if (keyword === 'CLASS') {
        //* Add user to class
      } else if (keyword === 'PROGRAM') {
        //* Add user to program
        await this.userProgramService.create({
          programId: id,
          userId,
          time: new Date(),
        });

        await this.paymentService.create({
          programId: id,
          userId,
          transactionId: response.id,
          amount,
          method: 'paypal',
        });
        return res.redirect(process.env.PAYPAL_REDIRECT_SUCCESS);
      } else {
        throw new NotFoundException('Not found class/program');
      }
    } else {
      throw new InternalServerErrorException('Add course/class failed!');
    }
    // return res.send({ message: 'Purchase payment successfully', response });
  }

  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'create',
    resource: 'payment',
    possession: 'own',
  })
  @Post('new')
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return {
      message: 'Create new payment successfully',
      metadata: await this.paymentService.create(createPaymentDto),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'payment',
    possession: 'own',
  })
  @Get('all')
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return {
      message: 'Get all payments successfully',
      metadata: await this.paymentService.findAll(page, limit),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'read',
    resource: 'payment',
    possession: 'own',
  })
  @Get('item/:id')
  async findOne(@Param('id') id: string) {
    return {
      message: 'Get payment detail successfully',
      metadata: await this.paymentService.findOne(+id),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'update',
    resource: 'payment',
    possession: 'own',
  })
  @Patch('item/:id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return {
      message: 'Update payment successfully',
      metadata: await this.paymentService.update(+id, updatePaymentDto),
    };
  }
  @UseGuards(RolesGuard)
  @UseRoles({
    action: 'delete',
    resource: 'payment',
    possession: 'own',
  })
  @Delete('item/:id')
  async remove(@Param('id') id: string) {
    return {
      message: 'Delete payment successfully',
      metadata: await this.paymentService.remove(+id),
    };
  }

 @Get('search/:startTime/:endTime/:type')
  async SearchPayment(
    @Param('startTime') startTime: Date,
    @Param('endTime') endTime: Date,
    @Param('type') type: string,
  ) {
    return {
      message: 'Search payment successfully',
      metadata: await this.paymentService.totalRevenue(startTime, endTime, type),
    };
  }

  @Get('export/:startTime/:endTime/:type')
  async exportRevenueReportToExcelFile(
    @Param('startTime') startTime: Date,
    @Param('endTime') endTime: Date,
    @Param('type') type: string,
  ) {
    return {
      message: 'Export revenue report to excel file successfully',
      metadata: await this.paymentService.searchPayment(startTime, endTime, type),
    }
  }
}
