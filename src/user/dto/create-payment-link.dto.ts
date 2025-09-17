import { IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePaymentLinkDto {
  @ApiProperty({ required: false, description: 'Fixed amount for the payment link. If not provided, it will be an open amount link.' })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiProperty({ required: false, default: false, description: 'Whether this is an open amount link (user can enter any amount)' })
  @IsOptional()
  @IsBoolean()
  openAmount?: boolean;
}