import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class DepositDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, default: 'NGN' })
  @IsOptional()
  @IsString()
  currency?: string;
}

export class WithdrawDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ default: 'NGN' })
  @IsString()
  currency: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  destinationAccount?: string;
}

export class SendDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ default: 'NGN' })
  @IsString()
  currency: string;

  @ApiProperty()
  @IsString()
  recipientId: string;
}

export class UpdateDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currency?: string;
}
