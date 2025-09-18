import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { OtpService } from '../otp/otp.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  CreateUserDto,
  LoginDto,
  InitialSignupDto,
  CompleteSignupDto,
  ResetPasswordDto,
  InitialSignupResponseDto,
  CompleteSignupResponseDto,
  AuthResponseDto,
} from '../user/dto/auth.dto';

interface PendingSignup {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  referredByCode?: string;
  referralCode?: string;
  timestamp: number;
}

@Injectable()
export class AuthService {
  // Store pending signups in memory (in production, use Redis or database)
  private pendingSignups = new Map<string, PendingSignup>();
  private readonly PENDING_SIGNUP_EXPIRY = 30 * 60 * 1000; // 30 minutes

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private otpService: OtpService,
  ) {
    // Clean up expired pending signups every 10 minutes
    setInterval(() => this.cleanupExpiredPendingSignups(), 10 * 60 * 1000);
  }

  // ─── Original Validation Method ────────────────────────────────

  async validateUserByEmail(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.password);
    if (!ok) return null;
    return user;
  }

  // ─── Two-Step Signup Process ───────────────────────────────────

  async initiateSignup(dto: InitialSignupDto): Promise<InitialSignupResponseDto> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Store pending signup data
    this.pendingSignups.set(dto.email, {
      email: dto.email,
      password: hashedPassword,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      referredByCode: dto.referredByCode,
      referralCode: dto.referralCode,
      timestamp: Date.now(),
    });

    // Send OTP
    const otpResult = await this.otpService.sendOtp(dto.email, 'SIGNUP');

    return {
      success: true,
      message: 'Verification code sent to your email',
      email: dto.email,
      otpExpiresAt: otpResult.expiresAt,
    };
  }

  async completeSignup(dto: CompleteSignupDto): Promise<CompleteSignupResponseDto> {
    // Get pending signup data
    const pendingSignup = this.pendingSignups.get(dto.email);
    if (!pendingSignup) {
      throw new BadRequestException('No pending signup found. Please start the signup process again.');
    }

    // Check if pending signup has expired
    if (Date.now() - pendingSignup.timestamp > this.PENDING_SIGNUP_EXPIRY) {
      this.pendingSignups.delete(dto.email);
      throw new BadRequestException('Signup session expired. Please start again.');
    }

    // Verify OTP
    await this.otpService.verifyOtp(dto.email, dto.otpCode, 'SIGNUP');

    // Double-check email doesn't exist (race condition protection)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      this.pendingSignups.delete(dto.email);
      throw new ConflictException('Email already registered');
    }

    try {
      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: pendingSignup.email,
          password: pendingSignup.password,
          firstName: pendingSignup.firstName,
          lastName: pendingSignup.lastName,
          phone: pendingSignup.phone,
          referredById: pendingSignup.referredByCode ? await this.findReferrerId(pendingSignup.referredByCode) : undefined,
          tag: await this.generateUniqueTag(pendingSignup.firstName, pendingSignup.lastName),
          referralCode: await this.generateUniqueReferralCode(),
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          tag: true,
          createdAt: true,
        },
      });

      // Create default wallet
      await this.prisma.wallet.create({
        data: {
          userId: user.id,
          currency: 'NGN',
          balance: BigInt(0),
        },
      });

      // Generate tokens
      const tokens = await this.generateTokens(user.id, user.email);

      // Clean up
      this.pendingSignups.delete(dto.email);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName ?? undefined,
          lastName: user.lastName ?? undefined,
          phone: user.phone ?? undefined,
          tag: user.tag ?? undefined,
          createdAt: user.createdAt,
        },
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      };
    } catch (error) {
      // Clean up on error
      this.pendingSignups.delete(dto.email);
      throw error;
    }
  }

 async resendSignupOtp(email: string) {
  const pendingSignup = this.pendingSignups.get(email);
  if (!pendingSignup) {
    throw new BadRequestException('No pending signup found for this email');
  }

  return this.otpService.sendOtp(email, 'SIGNUP');
}


  // ─── Traditional Authentication ────────────────────────────────

  async signup(dto: CreateUserDto): Promise<AuthResponseDto> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        referredById: dto.referredByCode ? await this.findReferrerId(dto.referredByCode) : undefined,
        tag: await this.generateUniqueTag(dto.firstName, dto.lastName),
        referralCode: await this.generateUniqueReferralCode(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        tag: true,
        createdAt: true,
      },
    });

    // Create default wallet
    await this.prisma.wallet.create({
      data: {
        userId: user.id,
        currency: 'NGN',
        balance: BigInt(0),
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        phone: user.phone ?? undefined,
        tag: user.tag ?? undefined,
        createdAt: user.createdAt,
      },
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUserByEmail(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        phone: user.phone ?? undefined,
        tag: user.tag ?? undefined,
        createdAt: user.createdAt,
      },
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    };
  }

  // ─── Password Reset ─────────────────────────────────────────────

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    return this.otpService.sendOtp(email, 'RESET_PASSWORD');
  }

  async resetPassword(dto: ResetPasswordDto) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    // Verify OTP
    await this.otpService.verifyOtp(dto.email, dto.otpCode, 'RESET_PASSWORD');

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(dto.newPassword, saltRounds);

    // Update password
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { password: hashedPassword },
    });

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  // ─── Token Management ──────────────────────────────────────────

  async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRY', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRY', '7d'),
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    // Store refresh token in database (optional)
    // await this.storeRefreshToken(userId, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user.id, user.email);
  }

  async logout(userId: string) {
    // In a more robust implementation, you'd invalidate the refresh token here
    // await this.invalidateRefreshToken(userId);
    
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  // ─── Account Verification ──────────────────────────────────────

  async checkEmailVerification(email: string) {
    const isVerified = await this.otpService.isEmailVerified(email, 'SIGNUP');
    return {
      email,
      isVerified,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        tag: true,
        referralCode: true,
        kycStatus: true,
        biometricEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      phone: user.phone ?? undefined,
      tag: user.tag ?? undefined,
      referralCode: user.referralCode ?? undefined,
      kycStatus: user.kycStatus ?? undefined,
      biometricEnabled: user.biometricEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // ─── Helper Methods ─────────────────────────────────────────────

  private async findReferrerId(referralCode: string): Promise<string | undefined> {
    const referrer = await this.prisma.user.findUnique({
      where: { referralCode },
      select: { id: true },
    });
    return referrer?.id;
  }

  private async generateUniqueTag(firstName?: string, lastName?: string): Promise<string> {
    let baseTag = '';
    
    if (firstName) {
      baseTag = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    
    if (lastName) {
      baseTag += lastName.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
    
    if (!baseTag) {
      baseTag = 'user';
    }

    // Try the base tag first
    const existingTag = await this.prisma.user.findUnique({
      where: { tag: baseTag },
    });

    if (!existingTag) {
      return baseTag;
    }

    // Generate unique tag with numbers
    let counter = 1;
    let uniqueTag = `${baseTag}${counter}`;
    
    while (await this.prisma.user.findUnique({ where: { tag: uniqueTag } })) {
      counter++;
      uniqueTag = `${baseTag}${counter}`;
    }

    return uniqueTag;
  }

  private async generateUniqueReferralCode(): Promise<string> {
    let referralCode: string;
    let exists = true;

    do {
      // Generate 8-character alphanumeric code
      referralCode = randomBytes(4).toString('hex').toUpperCase();
      
      const existingCode = await this.prisma.user.findUnique({
        where: { referralCode },
      });
      
      exists = !!existingCode;
    } while (exists);

    return referralCode;
  }

  private cleanupExpiredPendingSignups(): void {
    const now = Date.now();
    for (const [email, signup] of this.pendingSignups.entries()) {
      if (now - signup.timestamp > this.PENDING_SIGNUP_EXPIRY) {
        this.pendingSignups.delete(email);
      }
    }
  }
}