import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { RateService } from './rate.service';

@Controller('webhooks')
export class DepositController {
  constructor(private crypto: CryptoService, private rate: RateService) {}

  @Post('deposit')
  async webhook(@Body() body: { address: string; txHash: string; amount: string; currency: string }) {
    // basic webhook handler: expects amount as string (to support big ints)
    const { address, txHash, amount, currency } = body;
    const rate = await this.rate.getRate(currency);
    const parsed = BigInt(amount);
    // spread between 1% and 5% - here fixed 2%
    const spread = 0.02;
    const deposit = await this.crypto.processDeposit(address, txHash, parsed, currency, rate, spread);
    return { ok: true, depositId: deposit.id };
  }
}
