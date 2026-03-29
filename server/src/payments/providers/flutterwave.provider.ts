import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FlutterwaveProvider {
  private logger = new Logger(FlutterwaveProvider.name);
  private secret: string;
  private base = 'https://api.flutterwave.com/v3';

  constructor(private config: ConfigService) {
    this.secret =
      this.config.get<string>('FLUTTERWAVE_SECRET') ||
      process.env.FLUTTERWAVE_SECRET ||
      '';
    if (!this.secret) this.logger.warn('FLUTTERWAVE_SECRET not configured');
  }

  private headers() {
    return {
      Authorization: `Bearer ${this.secret}`,
      'Content-Type': 'application/json',
    };
  }

  async createBeneficiary({
    account_number,
    bank_code,
    name,
  }: {
    account_number: string;
    bank_code: string;
    name: string;
  }) {
    if (!this.secret) throw new Error('Flutterwave secret not configured');
    const url = `${this.base}/beneficiaries`;
    const payload = {
      account_number,
      bank_code,
      account_name: name,
      currency: 'NGN',
    };
    const res = await axios.post(url, payload, { headers: this.headers() });
    return res.data;
  }

  async transfer({
    account_bank,
    account_number,
    amount,
    narration,
    currency = 'NGN',
    reference,
  }: {
    account_bank: string;
    account_number: string;
    amount: number;
    narration?: string;
    currency?: string;
    reference?: string;
  }) {
    if (!this.secret) throw new Error('Flutterwave secret not configured');
    const url = `${this.base}/transfers`;
    const payload = {
      account_bank,
      account_number,
      amount,
      narration,
      currency,
      reference,
    };
    const res = await axios.post(url, payload, { headers: this.headers() });
    return res.data;
  }
}
