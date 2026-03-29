import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OtpType {
  SIGNUP = 'SIGNUP',
  LOGIN = 'LOGIN',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

export class SendOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ enum: OtpType, default: OtpType.SIGNUP })
  @IsOptional()
  @IsEnum(OtpType)
  type?: OtpType = OtpType.SIGNUP;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  code: string;

  @ApiProperty({ enum: OtpType, default: OtpType.SIGNUP })
  @IsOptional()
  @IsEnum(OtpType)
  type?: OtpType = OtpType.SIGNUP;
}

export class ResendOtpDto {
  email: string;
}
