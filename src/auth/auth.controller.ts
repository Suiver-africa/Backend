import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { OtpService } from '../otp/otp.service';
import {
  LoginDto,
  CreateUserDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
} from '../user/dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ───── Authentication ─────

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ───── OTP Management ─────

  @ApiOperation({ summary: 'Send OTP to email/phone' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('otp/send')
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.email, dto.type);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('otp/verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.email, dto.code, dto.type);
  }

  // ───── Password Reset ─────

  @ApiOperation({ summary: 'Request password reset OTP' })
  @ApiResponse({ status: 200, description: 'OTP sent for password reset' })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ───── Token Management ─────

  @ApiOperation({ summary: 'Refresh JWT access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('me')
  async getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.id);
  }

  // ───── Admin Login ─────

  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin login successful' })
  @HttpCode(HttpStatus.OK)
  @Post('admin/login')
  async adminLogin(@Body() dto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: 'admin',
    });

    return { token };
  }
}
