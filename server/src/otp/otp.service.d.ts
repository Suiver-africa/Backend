import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
export interface SendOtpResult {
    success: boolean;
    message: string;
    expiresAt: Date;
}
export interface VerifyOtpResult {
    success: boolean;
    message: string;
}
export declare class OtpService {
    private prisma;
    private configService;
    private mailService;
    private readonly OTP_LENGTH;
    private readonly OTP_EXPIRY_MINUTES;
    private readonly MAX_ATTEMPTS;
    private readonly RATE_LIMIT_MINUTES;
    constructor(prisma: PrismaService, configService: ConfigService, mailService: MailService);
    sendOtp(email: string, type?: 'SIGNUP' | 'LOGIN' | 'RESET_PASSWORD'): Promise<SendOtpResult>;
    verifyOtp(email: string, code: string, type?: 'SIGNUP' | 'LOGIN' | 'RESET_PASSWORD'): Promise<VerifyOtpResult>;
    isEmailVerified(email: string, type?: 'SIGNUP' | 'LOGIN' | 'RESET_PASSWORD'): Promise<boolean>;
    cleanupExpiredOtps(): Promise<void>;
    private generateOtp;
    private checkRateLimit;
    private sendOtpEmail;
    private getEmailSubject;
    private getEmailBody;
}
