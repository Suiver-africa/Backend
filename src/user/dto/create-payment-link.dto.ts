// create-payment-link.dto.ts
import { IsNumber, IsString } from 'class-validator';

export class CreatePaymentLinkDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  description: string;

  @IsString()
  redirectUrl: string;
}
