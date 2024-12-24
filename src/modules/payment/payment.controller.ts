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
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { HttpExceptionFilter } from 'src/common/exception-filter/http-exception.filter';
import { ResponseFormatInterceptor } from 'src/common/intercepters/response.interceptor';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UseRoles } from 'nest-access-control';

@Controller('payments')
@UseFilters(HttpExceptionFilter)
@UseInterceptors(ResponseFormatInterceptor)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

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
    @Body('status') status: string = 'active',
  ) {
    return {
      message: 'Get all payments successfully',
      metadata: await this.paymentService.findAll(page, limit, status),
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
}
