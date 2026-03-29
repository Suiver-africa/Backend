import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WalletService } from './wallets.service';
import { DepositDto, WithdrawDto, SendDto } from '../user/dto/wallet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('Wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('me/balance')
  getMyBalance(@Req() req: Request & { user: { id: string } }) {
    return this.walletService.getBalance(req.user.id);
  }

  @Post('me/deposit')
  @ApiOperation({ summary: 'Deposit funds into current user wallet' })
  deposit(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: DepositDto,
  ) {
    return this.walletService.deposit(req.user.id, dto);
  }

  @Post('me/withdraw')
  @ApiOperation({ summary: 'Withdraw funds from current user wallet' })
  withdraw(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: WithdrawDto,
  ) {
    return this.walletService.withdraw(req.user.id, dto);
  }

  @Post('me/send')
  @ApiOperation({ summary: 'Send funds to another user' })
  send(@Req() req: Request & { user: { id: string } }, @Body() dto: SendDto) {
    return this.walletService.send(req.user.id, dto);
  }

  // Optional: Admin/lookup
  @Get(':userId/balance')
  @ApiOperation({ summary: 'Get wallet balance by userId (admin)' })
  getBalance(@Param('userId') userId: string) {
    return this.walletService.getBalance(userId);
  }
}
