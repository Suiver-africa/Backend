import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { OtpService } from '../otp/otp.service';
import {
  CreateUserDto,
  LoginDto,
  InitialSignupDto,
  CompleteSignupDto,
  SendOtpDto,
  VerifyOtpDto,
  ResendOtpDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  SendOtpResponseDto,
  VerifyOtpResponseDto,
  InitialSignupResponseDto,
  CompleteSignupResponseDto,
  AuthResponseDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {JwtRefreshStrategy } from '../auth/jwt-refresh.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  // ─── OTP Management ────────────────────────────────────────────

  @ApiOperation({ summary: 'Send OTP to email' })
  @ApiResponse({ status: 200, type: SendOtpResponseDto })
  @ApiResponse({ status: 400, description: 'Email already exists or invalid request' })
  @HttpCode(HttpStatus.OK)
  @Post('send-otp')
  sendOtp(@Body() dto: SendOtpDto) {
    return this.otpService.sendOtp(dto.email, dto.type);
  }

  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 200, type: VerifyOtpResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid OTP or OTP expired' })
  @HttpCode(HttpStatus.OK)
  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.email, dto.code, dto.type);
  }

  @ApiOperation({ summary: 'Resend OTP for signup verification' })
  @ApiResponse({ status: 200, type: SendOtpResponseDto })
  @ApiResponse({ status: 400, description: 'No pending signup found or rate limited' })
  @HttpCode(HttpStatus.OK)
  @Post('resend-otp')
  resendOtp(@Body() dto: ResendOtpDto) {
    return this.authService.resendSignupOtp(dto.email);
  }

  // ─── Two-Step Registration ─────────────────────────────────────

  @ApiOperation({ summary: 'Initiate signup process' })
  @ApiResponse({ status: 200, type: InitialSignupResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('signup/init')
  initiateSignup(@Body() dto: InitialSignupDto) {
    return this.authService.initiateSignup(dto);
  }

  @ApiOperation({ summary: 'Complete signup process' })
  @ApiResponse({ status: 201, type: CompleteSignupResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup/complete')
  completeSignup(@Body() dto: CompleteSignupDto) {
    return this.authService.completeSignup(dto);
  }

  // ─── Traditional Authentication ────────────────────────────────

  @ApiOperation({ summary: 'Direct signup (testing/admin only)' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── Password Reset ─────────────────────────────────────────────

  @ApiOperation({ summary: 'Initiate password reset' })
  @ApiResponse({ status: 200, type: SendOtpResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @ApiOperation({ summary: 'Reset password with OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ─── Token Management ──────────────────────────────────────────

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @UseGuards(JwtRefreshStrategy) // 👈 use refresh guard here
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @ApiOperation({ summary: 'Logout user (invalidate tokens)' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // 👈 only access token needed here
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  // ─── Account Verification ──────────────────────────────────────

  @ApiOperation({ summary: 'Check if email is verified' })
  @ApiResponse({ status: 200, description: 'Email verification status' })
  @HttpCode(HttpStatus.OK)
  @Post('check-verification')
  checkEmailVerification(@Body() body: { email: string }) {
    return this.authService.checkEmailVerification(body.email);
  }

  @ApiOperation({ summary: 'Get current user info from token' })
  @ApiResponse({ status: 200, description: 'Current user information' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me')
  getCurrentUser(@Request() req) {
    return this.authService.getCurrentUser(req.user.id);
  }
}
    