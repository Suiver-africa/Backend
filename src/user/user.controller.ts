import { Controller, Post, Patch, Get, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { KycDto } from './dto/kyc.dto';
import { DepositDto, WithdrawDto, SendDto } from './dto/wallet.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /** ----------------- AUTH ----------------- */
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  /** ----------------- TAG ----------------- */
  @UseGuards(JwtAuthGuard)
  @Patch('tag')
  setTag(@Req() req, @Body('tag') tag: string) {
    return this.userService.setUserTag(req.user.id, tag);
  }

  /** ----------------- KYC ----------------- */
  @UseGuards(JwtAuthGuard)
  @Post('kyc')
  submitKyc(@Req() req, @Body() dto: KycDto) {
    return this.userService.submitKyc(req.user.id, dto);
  }

  /** ----------------- WALLET ----------------- */
 @Post('deposit')
deposit(@Req() req, @Body() dto: DepositDto) {
  return this.userService.deposit(req.user.id, dto);
}


@UseGuards(JwtAuthGuard)
@Post('withdraw')
withdraw(@Req() req, @Body() dto: WithdrawDto) {
  if (!dto.destinationAccount) throw new Error('destinationAccount is required');
  return this.userService.withdraw(req.user.id, dto);
}


@UseGuards(JwtAuthGuard)
@Post('send')
sendMoney(@Req() req, @Body() dto: SendDto) {
  return this.userService.sendMoney(req.user.id, dto);
}



  /** ----------------- TRANSACTIONS ----------------- */
  @UseGuards(JwtAuthGuard)
  @Post('transaction')
  createTransaction(@Req() req, @Body() dto: CreateTransactionDto) {
    return this.userService.createTransaction(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  listTransactions(@Req() req) {
    return this.userService.listTransactions(req.user.id);
  }

  /** ----------------- PAYMENT LINKS ----------------- */
  @UseGuards(JwtAuthGuard)
  @Post('payment-link')
  createPaymentLink(@Req() req, @Body() dto: CreatePaymentLinkDto) {
    return this.userService.createPaymentLink(req.user.id, dto);
  }
}

@Controller('beneficiaries')
export class BeneficiaryController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  add(@Req() req, @Body() dto: CreateBeneficiaryDto) {
    return this.userService.addBeneficiary(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req) {
    return this.userService.listBeneficiaries(req.user.id);
  }
}
