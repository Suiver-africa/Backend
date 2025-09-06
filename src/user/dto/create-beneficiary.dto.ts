// src/user/dto/create-beneficiary.dto.ts
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBeneficiaryDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  tag: string; // recipient's unique Suiver tag

  @IsOptional()
  bankName?: string;

  @IsNotEmpty()
  accountNo?: string;

}
