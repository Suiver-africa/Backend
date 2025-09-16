import { IsNotEmpty } from 'class-validator';

export class UseReferralDto {
  @IsNotEmpty()
  inviteeId: string;

  @IsNotEmpty()
  code: string;
}
