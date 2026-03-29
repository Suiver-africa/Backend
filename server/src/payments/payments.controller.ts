import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('airtime')
  async airtime(@Req() req, @Body() body: { phone: string; amount: number }) {
    return this.payments.buyAirtime(req.user.id, body.phone, body.amount);
  }
}
