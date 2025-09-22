import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaystackService {
  private logger = new Logger(PaystackService.name);
  private secret: string;

  constructor(private config: ConfigService) {
    this.secret = this.config.get<string>('PAYSTACK_SECRET') || process.env.PAYSTACK_SECRET || '';
    if (!this.secret) {
      this.logger.warn('PAYSTACK_SECRET not configured - payouts will fail until configured');
    }
  }

  /**
   * triggerPayout
   * - Accepts recipient bank details and amount in kobo (NGN * 100)
   * - Returns the Paystack transfer response (minimal fields)
   */
  async triggerPayout({ account_number, bank_code, amount, currency = 'NGN', reference }: {
    account_number: string,
    bank_code: string,
    amount: number,
    currency?: string,
    reference?: string
  }) {
    if (!this.secret) throw new Error('Paystack secret not configured');
    const url = 'https://api.paystack.co/transfer';
    const payload = {
      source: 'balance',
      amount,
      recipient: null,
      reason: 'deposit payment',
      reference
    };
    // Note: Proper flow requires first creating a recipient then initiating transfer.
    // This function demonstrates the transfer call shape. Replace with two-step flow.
    this.logger.log(`(Paystack) triggerPayout mock - amount ${amount} ${currency}`);
    // *Mocked response* - do not actually call external API in this environment
    return {
      status: true,
      message: 'Mocked transfer created',
      data: {
        id: 'mock_tr_' + Date.now(),
        amount,
        currency,
        reference: reference || 'mockref' + Date.now(),
        status: 'pending'
      }
    };
  }
}
