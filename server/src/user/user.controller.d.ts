import { AuthService } from '../auth/auth.service';
import { OtpService } from '../otp/otp.service';
import { CreateUserDto, LoginDto, InitialSignupDto, CompleteSignupDto, SendOtpDto, VerifyOtpDto, ResendOtpDto, ForgotPasswordDto, ResetPasswordDto, InitialSignupResponseDto, CompleteSignupResponseDto, AuthResponseDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    private readonly otpService;
    constructor(authService: AuthService, otpService: OtpService);
    sendOtp(dto: SendOtpDto): Promise<import("../otp/otp.service").SendOtpResult>;
    verifyOtp(dto: VerifyOtpDto): Promise<import("../otp/otp.service").VerifyOtpResult>;
    resendOtp(dto: ResendOtpDto): Promise<import("../otp/otp.service").SendOtpResult>;
    initiateSignup(dto: InitialSignupDto): Promise<InitialSignupResponseDto>;
    completeSignup(dto: CompleteSignupDto): Promise<CompleteSignupResponseDto>;
    signup(dto: CreateUserDto): Promise<AuthResponseDto>;
    login(dto: LoginDto): Promise<AuthResponseDto>;
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
    checkEmailVerification(body: {
        email: string;
    }): Promise<{
        email: string;
        isVerified: boolean;
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
}
