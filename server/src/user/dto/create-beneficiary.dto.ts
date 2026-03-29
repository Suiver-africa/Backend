import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateBeneficiaryDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  tag: string;
  @IsOptional()
  accountNo?: string;
  @IsOptional()
  bankName?: string;
}
