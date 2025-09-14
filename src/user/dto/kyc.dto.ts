import { IsNotEmpty } from 'class-validator';
export class KycDto {
  @IsNotEmpty()
  idType: string;
  @IsNotEmpty()
  documentUrl: string;
}