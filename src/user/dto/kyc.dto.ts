<<<<<<< Updated upstream
import { IsNotEmpty } from 'class-validator';
export class KycDto {
  @IsNotEmpty()
  idType: string;
  @IsNotEmpty()
  documentUrl: string;
}
=======
import { IsOptional, IsString } from 'class-validator';

export class KycDto {
  @IsOptional()
  @IsString()
  kycStatus?: string; // e.g. PENDING, APPROVED, REJECTED

  @IsOptional()
  @IsString()
  socType?: string; // e.g. NIN, BVN, PASSPORT

  @IsOptional()
  @IsString()
  idType?: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;
}
>>>>>>> Stashed changes
