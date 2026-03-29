import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaystackService {
  private logger = new Logger(PaystackService.name);
  private secret: string;

  constructor(private config: ConfigService) {
    this.secret =
      this.config.get<string>('PAYSTACK_SECRET') ||
      process.env.PAYSTACK_SECRET ||
      '';
    if (!this.secret) {
      this.logger.warn(
        'PAYSTACK_SECRET not configured - payouts will fail until configured',
      );
    }
  }

  /**
   * verifyAccount
   * - Verifies a bank account number and bank code
   */
  async verifyAccount(account_number: string, bank_code: string) {
    if (!this.secret) throw new Error('Paystack secret not configured');
    try {
      const response = await axios.get(
        `https://api.paystack.co/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
        {
          headers: { Authorization: `Bearer ${this.secret}` },
        },
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        'Paystack account verification failed:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * triggerPayout
   * - 1. Creates a transfer recipient
   * - 2. Initiates the transfer
   */
  async triggerPayout({
    account_number,
    bank_code,
    amount,
    currency = 'NGN',
    reference,
    account_name,
  }: {
    account_number: string;
    bank_code: string;
    amount: number;
    currency?: string;
    reference?: string;
    account_name: string;
  }) {
    if (!this.secret) throw new Error('Paystack secret not configured');

    try {
      // 1. Create Transfer Recipient
      const recipientResponse = await axios.post(
        'https://api.paystack.co/transferrecipient',
        {
          type: 'nuban',
          name: account_name,
          account_number,
          bank_code,
          currency,
        },
        {
          headers: { Authorization: `Bearer ${this.secret}` },
        },
      );

      if (!recipientResponse.data.status) {
        throw new Error('Failed to create Paystack transfer recipient');
      }

      const recipientCode = recipientResponse.data.data.recipient_code;

      // 2. Initiate Transfer
      const transferResponse = await axios.post(
        'https://api.paystack.co/transfer',
        {
          source: 'balance',
          amount, // amount in kobo
          recipient: recipientCode,
          reason: 'Suiver Payout',
          reference,
        },
        {
          headers: { Authorization: `Bearer ${this.secret}` },
        },
      );

      return transferResponse.data;
    } catch (error) {
      this.logger.error(
        'Paystack payout failed:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
