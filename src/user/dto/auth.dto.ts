import { IsEmail, IsString, MinLength, IsOptional, Length, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// Enum for OTP types
export enum OtpType {
  SIGNUP = 'SIGNUP',
  LOGIN = 'LOGIN',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

// ─── Original DTOs (Updated) ──────────────────────

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referredByCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referralCode?: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;
}

// ─── OTP DTOs ─────────────────────────────────────

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

// ─── Two-Step Signup DTOs ────────────────────────

export class InitialSignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: '+2348012345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'REF123456', required: false })
  @IsOptional()
  @IsString()
  referredByCode?: string;

  @ApiProperty({ example: 'REF123456', required: false })
  @IsOptional()
  @IsString()
  referralCode?: string;
}

export class CompleteSignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otpCode: string;
}

// ─── Response DTOs ────────────────────────────────

export class SendOtpResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  expiresAt: Date;
}

export class VerifyOtpResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}

export class InitialSignupResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  otpExpiresAt: Date;
}

export class CompleteSignupResponseDto {
  @ApiProperty()
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tag?: string;
    createdAt: Date;
  };

  @ApiProperty()
  accessToken: string;

  @ApiProperty({ required: false })
  refreshToken?: string;
}

export class AuthResponseDto {
  @ApiProperty()
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    tag?: string;
    createdAt: Date;
  };

  @ApiProperty()
  accessToken: string;

  @ApiProperty({ required: false })
  refreshToken?: string;
}

// ─── Additional DTOs ──────────────────────────────

export class ResendOtpDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otpCode: string;

  @ApiProperty({ example: 'NewStrongPassword123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}