import { AuthService } from './auth.service';
import { OtpService } from '../otp/otp.service';
import { LoginDto, CreateUserDto, ForgotPasswordDto, ResetPasswordDto, SendOtpDto, VerifyOtpDto } from '../user/dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthController {
    private readonly authService;
    private readonly otpService;
    private readonly prisma;
    private readonly jwtService;
    constructor(authService: AuthService, otpService: OtpService, prisma: PrismaService, jwtService: JwtService);
    signup(dto: CreateUserDto): Promise<import("../user/dto/auth.dto").AuthResponseDto>;
    login(dto: LoginDto): Promise<import("../user/dto/auth.dto").AuthResponseDto>;
    sendOtp(dto: SendOtpDto): Promise<import("../otp/otp.service").SendOtpResult>;
    verifyOtp(dto: VerifyOtpDto): Promise<import("../otp/otp.service").VerifyOtpResult>;
    forgotPassword(dto: ForgotPasswordDto): Promise<import("../otp/otp.service").SendOtpResult>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    refreshToken(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getCurrentUser(req: any): Promise<{
        id: string;
        email: string | null;
        firstName: any;
        lastName: any;
        phone: string;
        tag: any;
        referralCode: string;
        kycStatus: import(".prisma/client").$Enums.KycStatus;
        biometricEnabled: any;
        createdAt: Date;
        updatedAt: Date;
    }>;
    adminLogin(dto: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
}
