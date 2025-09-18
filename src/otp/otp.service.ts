import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'crypto';

export interface SendOtpResult {
  success: boolean;
  message: string;
  expiresAt: Date;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
}

@Injectable()
export class OtpService {
  private readonly OTP_LENGTH = 6;
  private readonly OTP_EXPIRY_MINUTES = 12; 
  private readonly MAX_ATTEMPTS = 4;
  private readonly RATE_LIMIT_MINUTES = 5; // Can't request new OTP for 5 minutes after max attempts

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate and send OTP for email verification
   */
  async sendOtp(email: string, type: 'SIGNUP' | 'LOGIN' | 'RESET_PASSWORD' = 'SIGNUP'): Promise<SendOtpResult> {
    // Check if email already exists for signup
    if (type === 'SIGNUP') {
      const existingUser = await this.prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }
    }

    // Check rate limiting
    await this.checkRateLimit(email, type);

    // Generate OTP
    const otpCode = this.generateOtp();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    // Save OTP to database
    await this.prisma.otp.upsert({
      where: {
        email_type: {
          email,
          type,
        },
      },
      update: {
        code: otpCode,
        expiresAt,
        attempts: 0,
        verified: false,
        createdAt: new Date(),
      },
      create: {
        email,
        type,
        code: otpCode,
        expiresAt,
        attempts: 0,
        verified: false,
      },
    });

    // Send OTP via email (implement your email service here)
    await this.sendOtpEmail(email, otpCode, type);

    return {
      success: true,
      message: `OTP sent to ${email}`,
      expiresAt,
    };
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(email: string, code: string, type: 'SIGNUP' | 'LOGIN' | 'RESET_PASSWORD' = 'SIGNUP'): Promise<VerifyOtpResult> {
    const otp = await this.prisma.otp.findUnique({
      where: {
        email_type: {
          email,
          type,
        },
      },
    });

    if (!otp) {
      throw new BadRequestException('No OTP found. Please request a new one.');
    }

    // Check if already verified
    if (otp.verified) {
      throw new BadRequestException('OTP already used. Please request a new one.');
    }

    // Check expiry
    if (new Date() > otp.expiresAt) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    // Check max attempts
    if (otp.attempts >= this.MAX_ATTEMPTS) {
      throw new BadRequestException('Maximum verification attempts exceeded. Please request a new OTP.');
    }

    // Increment attempts
    await this.prisma.otp.update({
      where: {
        email_type: {
          email,
          type,
        },
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    // Verify code
    if (otp.code !== code) {
      const remainingAttempts = this.MAX_ATTEMPTS - (otp.attempts + 1);
      if (remainingAttempts > 0) {
        throw new UnauthorizedException(`Invalid OTP. ${remainingAttempts} attempts remaining.`);
      } else {
        throw new UnauthorizedException('Invalid OTP. Maximum attempts exceeded. Please request a new OTP.');
      }
    }

    // Mark as verified
    await this.prisma.otp.update({
      where: {
        email_type: {
          email,
          type,
        },
      },
      data: {
        verified: true,
      },
    });

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  /**
   * Check if email is verified (OTP was successfully verified)
   */
  async isEmailVerified(email: string, type: 'SIGNUP' | 'LOGIN' | 'RESET_PASSWORD' = 'SIGNUP'): Promise<boolean> {
    const otp = await this.prisma.otp.findUnique({
      where: {
        email_type: {
          email,
          type,
        },
      },
    });

    return otp?.verified === true && new Date() <= otp.expiresAt;
  }

  /**
   * Clean up expired and old OTPs
   */
  async cleanupExpiredOtps(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    await this.prisma.otp.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } }, // Expired
          { createdAt: { lt: oneDayAgo } }, // Older than 24 hours
        ],
      },
    });
  }

  /**
   * Generate random OTP
   */
  private generateOtp(): string {
    const min = Math.pow(10, this.OTP_LENGTH - 1);
    const max = Math.pow(10, this.OTP_LENGTH) - 1;
    return randomInt(min, max + 1).toString();
  }

  /**
   * Check rate limiting to prevent spam
   */
  private async checkRateLimit(email: string, type: string): Promise<void> {
    const rateLimitTime = new Date(Date.now() - this.RATE_LIMIT_MINUTES * 60 * 1000);
    
    const recentOtp = await this.prisma.otp.findFirst({
      where: {
        email,
        type,
        attempts: { gte: this.MAX_ATTEMPTS },
        createdAt: { gte: rateLimitTime },
      },
    });

    if (recentOtp) {
      const waitTime = Math.ceil((recentOtp.createdAt.getTime() + this.RATE_LIMIT_MINUTES * 60 * 1000 - Date.now()) / 60000);
      throw new BadRequestException(`Too many attempts. Please wait ${waitTime} minutes before requesting a new OTP.`);
    }
  }

  /**
   * Send OTP via email (implement with your preferred email service)
   */
  private async sendOtpEmail(email: string, otp: string, type: string): Promise<void> {
    // TODO: Implement with your email service (NodeMailer, SendGrid, AWS SES, etc.)
    console.log(`Sending OTP: ${otp} to ${email} for ${type}`);
    
    // Example implementation with console log for development
    const subject = this.getEmailSubject(type);
    const body = this.getEmailBody(otp, type);
    
    console.log(`
      To: ${email}
      Subject: ${subject}
      Body: ${body}
    `);

    // In production, replace with actual email sending:
    /*
    await this.emailService.sendEmail({
      to: email,
      subject,
      html: body,
    });
    */
  }

  /**
   * Get email subject based on OTP type
   */
  private getEmailSubject(type: string): string {
    switch (type) {
      case 'SIGNUP':
        return 'Verify Your Email - Welcome!';
      case 'LOGIN':
        return 'Login Verification Code';
      case 'RESET_PASSWORD':
        return 'Password Reset Verification';
      default:
        return 'Verification Code';
    }
  }

  /**
   * Get email body based on OTP type
   */
  private getEmailBody(otp: string, type: string): string {
    const appName = this.configService.get('APP_NAME', 'Your App');
    const baseMessage = `Your verification code is: <strong>${otp}</strong>`;
    const expiryMessage = `This code will expire in ${this.OTP_EXPIRY_MINUTES} minutes.`;

    switch (type) {
      case 'SIGNUP':
        return `
          <h2>Welcome to ${appName}!</h2>
          <p>Thank you for signing up. ${baseMessage}</p>
          <p>${expiryMessage}</p>
          <p>If you didn't request this, please ignore this email.</p>
        `;
      case 'LOGIN':
        return `
          <h2>Login Verification</h2>
          <p>${baseMessage}</p>
          <p>${expiryMessage}</p>
          <p>If you didn't request this, please secure your account immediately.</p>
        `;
      case 'RESET_PASSWORD':
        return `
          <h2>Password Reset</h2>
          <p>${baseMessage}</p>
          <p>${expiryMessage}</p>
          <p>If you didn't request this, please ignore this email.</p>
        `;
      default:
        return `
          <h2>Verification Code</h2>
          <p>${baseMessage}</p>
          <p>${expiryMessage}</p>
        `;
    }
  }
}