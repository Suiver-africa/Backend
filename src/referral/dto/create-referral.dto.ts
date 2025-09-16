import { IsNotEmpty } from 'class-validator';

export class CreateReferralDto {
  @IsNotEmpty()
  inviterId: string;

  @IsNotEmpty()
  // optional: if you want custom code; otherwise backend will generate
  code?: string;
}
