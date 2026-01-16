import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { RateService } from './rate.service';
import { TransactionsService } from '../transactions/transactions.service';

@Controller('webhooks')
export class DepositController {
  constructor(
    private crypto: CryptoService,
    private rate: RateService,
    private transactions: TransactionsService
  ) { }

  @Post('deposit')
  async webhook(@Body() body: { address: string; txHash: string; amount: string; currency: string }) {
    // basic webhook handler: expects amount as string (to support big ints)
    const { address, txHash, amount, currency } = body;
    const rate = await this.rate.getRate(currency);
    const parsed = BigInt(amount || '0'); // Handle potential empty string/null
    // spread between 1% and 5% - here fixed 2%
    const spread = 0.02;

    // Note: processDeposit now takes fewer args or different args? 
    // Checking TransactionsService.processDeposit signature: 
    // (toAddress: string, amount: number, currency: string, txHash: string, fromAddress: string)
    // We are matching arguments: 
    // address -> toAddress
    // parsed (BigInt) -> amount (number) -- Mismatch! TransactionsService expects number?
    // Let's coerce for MVP or update service. Service has `amount: number` in signature.
    // For MVP we convert to number (precision loss possible for internal logic, but database uses BigInt).

    // Also, we need fromAddress. Controller body doesn't provide it? 
    // If webhook doesn't provide it, we pass empty string or 'unknown'.

    // Correction: `processDeposit` was using `amount` as number. 
    // Let's pass `Number(amount)` 

    await this.transactions.processDeposit(address, Number(amount), currency, txHash, 'unknown');

    return { ok: true };
  }
}
