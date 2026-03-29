import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaystackProvider {
  private logger = new Logger(PaystackProvider.name);
  private secret: string;
  private base = 'https://api.paystack.co';

  constructor(private config: ConfigService) {
    this.secret =
      this.config.get<string>('PAYSTACK_SECRET') ||
      process.env.PAYSTACK_SECRET ||
      '';
    if (!this.secret) this.logger.warn('PAYSTACK_SECRET not configured');
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.secret}`,
      'Content-Type': 'application/json',
    };
  }

  async createRecipient({
    name,
    account_number,
    bank_code,
  }: {
    name: string;
    account_number: string;
    bank_code: string;
  }) {
    if (!this.secret) throw new Error('Paystack secret not configured');
    const url = `${this.base}/transferrecipient`;
    const payload = {
      type: 'nuban',
      name,
      account_number,
      bank_code,
      currency: 'NGN',
    };
    const res = await axios.post(url, payload, { headers: this.headers() });
    return res.data;
  }

  async initiateTransfer({
    recipient,
    amount,
    reference,
  }: {
    recipient: string;
    amount: number;
    reference?: string;
  }) {
    if (!this.secret) throw new Error('Paystack secret not configured');
    const url = `${this.base}/transfer`;
    const payload = { source: 'balance', amount, recipient, reference };
    const res = await axios.post(url, payload, { headers: this.headers() });
    return res.data;
  }
}
