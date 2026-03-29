export declare enum OtpType {
    SIGNUP = "SIGNUP",
    LOGIN = "LOGIN",
    RESET_PASSWORD = "RESET_PASSWORD"
}
export declare class CreateUserDto {
    email: string;
    password: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    referredByCode?: string;
    referralCode?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class SendOtpDto {
    email: string;
    type?: OtpType;
}
export declare class VerifyOtpDto {
    email: string;
    code: string;
    type?: OtpType;
}
export declare class InitialSignupDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    referredByCode?: string;
    referralCode?: string;
}
export declare class CompleteSignupDto {
    email: string;
    otpCode: string;
}
export declare class SendOtpResponseDto {
    success: boolean;
    message: string;
    expiresAt: Date;
}
export declare class VerifyOtpResponseDto {
    success: boolean;
    message: string;
}
export declare class InitialSignupResponseDto {
    success: boolean;
    message: string;
    email: string;
    otpExpiresAt: Date;
}
export declare class CompleteSignupResponseDto {
    user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        tag?: string;
        createdAt: Date;
    };
    accessToken: string;
    refreshToken?: string;
}
export declare class AuthResponseDto {
    user: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        tag?: string;
        createdAt: Date;
    };
    accessToken: string;
    refreshToken?: string;
}
export declare class ResendOtpDto {
    email: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    email: string;
    otpCode: string;
    newPassword: string;
}
