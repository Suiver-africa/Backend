import { Controller, Post, Get, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments/payments.service';
import { CryptoService } from './crypto/crypto.service';

@ApiTags('Payment Engine')
@Controller('api/payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private cryptoService: CryptoService
  ) { }

  @Get('crypto/prices')
  @ApiOperation({ summary: 'Get current cryptocurrency prices' })
  async getCryptoPrices() {
    return await this.cryptoService.getCryptoPrices();
  }

  @Post('crypto/convert')
  @ApiOperation({ summary: 'Convert crypto to Naira' })
  async convertCryptoToNaira(@Body() body: {
    userId: string;
    cryptocurrency: string;
    amount: number;
    walletAddress: string;
  }) {
    return await this.paymentService.processCryptoToNaira(
      body.userId,
      body.cryptocurrency,
      body.amount,
      body.walletAddress
    );
  }

  @Post('bills/pay')
  @ApiOperation({ summary: 'Pay utility bills' })
  async payBill(@Body() body: {
    userId: string;
    billType: string;
    amount: number;
    accountNumber: string;
    provider?: string;
  }) {
    return await this.paymentService.payBill(
      body.userId,
      body.billType,
      body.amount,
      body.accountNumber,
      body.provider
    );
  }

  @Post('transfer')
  @ApiOperation({ summary: 'Transfer money to another user' })
  async transferMoney(@Body() body: {
    fromUserId: string;
    toIdentifier: string;
    amount: number;
    message?: string;
  }) {
    return await this.paymentService.transferMoney(
      body.fromUserId,
      body.toIdentifier,
      body.amount,
      body.message
    );
  }

  @Post('payment-link')
  @ApiOperation({ summary: 'Create payment link for freelancers' })
  async createPaymentLink(@Body() body: {
    userId: string;
    title: string;
    amount: number;
    description?: string;
    expiresAt?: string;
  }) {
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;
    return await this.paymentService.createPaymentLink(
      body.userId,
      body.title,
      body.amount,
      body.description,
      expiresAt
    );
  }

  @Post('wallet/generate')
  @ApiOperation({ summary: 'Generate new crypto wallet' })
  async generateWallet(@Body() body: {
    userId: string;
    cryptocurrency: string;
  }) {
    const wallet = await this.cryptoService.generateWallet(body.cryptocurrency);
    return {
      success: true,
      address: wallet.address,
      // Note: In production, never return private keys in API responses
      // Store them encrypted in the database
      publicKey: wallet.publicKey
    };
  }

  @Get('wallet/:address/:crypto/balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getWalletBalance(
    @Param('address') address: string,
    @Param('crypto') cryptocurrency: string
  ) {
    const balance = await this.cryptoService.getWalletBalance(address, cryptocurrency);
    return {
      success: true,
      balance,
      cryptocurrency,
      address
    };
  }
}
