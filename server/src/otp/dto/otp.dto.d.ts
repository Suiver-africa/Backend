export declare enum OtpType {
    SIGNUP = "SIGNUP",
    LOGIN = "LOGIN",
    RESET_PASSWORD = "RESET_PASSWORD"
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
export declare class ResendOtpDto {
    email: string;
}
