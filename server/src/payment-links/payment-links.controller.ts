import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { PaymentLinksService } from './payment-links.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentLinkDto } from '../user/dto/create-payment-link.dto';

@Controller('payment-links')
export class PaymentLinksController {
  constructor(private svc: PaymentLinksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() dto: CreatePaymentLinkDto) {
    return this.svc.create(req.user.id, dto);
  }
}
