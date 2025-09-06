// wallet.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class DepositDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;
}

export class WithdrawDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  destinationAccount: string;
}

export class SendDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  recipientId: string;
}
