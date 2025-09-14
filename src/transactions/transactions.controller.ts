import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTransactionDto } from '../user/dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private tx: TransactionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  deposit(@Req() req, @Body() dto: any) {
    return this.tx.deposit(req.user.id, dto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send')
  send(@Req() req, @Body() dto: any) {
    return this.tx.send(req.user.id, dto.recipientTag || '', dto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  withdraw(@Req() req, @Body() dto: any) {
    return this.tx.withdraw(req.user.id, dto.amount, dto.destinationAccount || '');
  }
}