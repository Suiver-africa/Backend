import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class KycDto {
  @IsNotEmpty()
  idType: string;
  @IsNotEmpty()
  documentUrl: string;

   @IsOptional()
  @IsString()
 documentType: string;

   @IsOptional()
  @IsString()
  kycStatus?: string;
}