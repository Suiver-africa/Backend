import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';
export class CreatePaymentLinkDto {
  @IsOptional()
  @IsNumber()
  amount?: number;
  @IsOptional()
  @IsBoolean()
  openAmount?: boolean;

  @IsOptional()
  @IsString()
  title?: string;
}