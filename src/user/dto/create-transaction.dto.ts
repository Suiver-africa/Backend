// create-transaction.dto.ts
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsString()
  type: 'deposit' | 'withdraw' | 'send' | 'request';

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  recipientId?: string;
}
