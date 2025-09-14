import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
export class CreatePaymentLinkDto {
  @IsOptional()
  @IsNumber()
  amount?: number;
  @IsOptional()
  @IsBoolean()
  openAmount?: boolean;
}