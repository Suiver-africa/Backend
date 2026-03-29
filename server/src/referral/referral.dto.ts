import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ValidateReferralCodeDto {
  @ApiProperty({ example: 'ABC12345' })
  @IsString()
  referralCode: string;
}

export class ReferralStatsResponseDto {
  @ApiProperty()
  totalReferrals: number;

  @ApiProperty()
  totalRewards: number;

  @ApiProperty()
  myReferralCode: string;

  @ApiProperty()
  referrals: Array<{
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    reward: number;
  }>;
}
