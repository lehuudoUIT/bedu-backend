import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dtos/create-payment.dto';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('new')
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Get('all')
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.paymentService.findAll();
  }

  @Get('item/:id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id);
  }

  @Patch('item/:id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }

  @Delete('item/:id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
