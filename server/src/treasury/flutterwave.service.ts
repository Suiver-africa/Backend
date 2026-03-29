import { Injectable } from '@nestjs/common';
import { FlutterwaveProvider } from '../payments/providers/flutterwave.provider';

export interface CreateRecipientDto {
  account_number: string;
  bank_code: string;
  currency: string;
  name: string;
}

export interface InitiateTransferDto {
  recipient: string;
  amount: number;
  reason?: string;
}

@Injectable()
export class FlutterwaveService {
  constructor(private readonly provider: FlutterwaveProvider) {}

  async createRecipient(
    dto: CreateRecipientDto,
  ): Promise<{ id: string; [key: string]: any }> {
    const result = await this.provider.createBeneficiary({
      account_number: dto.account_number,
      bank_code: dto.bank_code,
      name: dto.name,
    });
    return result?.data ?? result;
  }

  async initiateTransfer(
    dto: InitiateTransferDto,
  ): Promise<{ id: string; [key: string]: any }> {
    const reference = `suiver-${Date.now()}`;
    const result = await this.provider.transfer({
      account_bank: dto.recipient,
      account_number: dto.recipient,
      amount: dto.amount,
      narration: dto.reason,
      currency: 'NGN',
      reference,
    });
    return result?.data ?? result;
  }
}
