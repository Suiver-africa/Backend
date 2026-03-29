import { PaymentsService } from './payments/payments.service';
import { CryptoService } from './crypto/crypto.service';
export declare class PaymentController {
    private paymentService;
    private cryptoService;
    constructor(paymentService: PaymentsService, cryptoService: CryptoService);
    getCryptoPrices(): Promise<import("./crypto/crypto.service").CryptoPrice[]>;
    convertCryptoToNaira(body: {
        userId: string;
        cryptocurrency: string;
        amount: number;
        walletAddress: string;
    }): Promise<any>;
    payBill(body: {
        userId: string;
        billType: string;
        amount: number;
        accountNumber: string;
        provider?: string;
    }): Promise<any>;
    transferMoney(body: {
        fromUserId: string;
        toIdentifier: string;
        amount: number;
        message?: string;
    }): Promise<any>;
    createPaymentLink(body: {
        userId: string;
        title: string;
        amount: number;
        description?: string;
        expiresAt?: string;
    }): Promise<any>;
    generateWallet(body: {
        userId: string;
        cryptocurrency: string;
    }): Promise<{
        success: boolean;
        address: string;
        publicKey: string;
    }>;
    getWalletBalance(address: string, cryptocurrency: string): Promise<{
        success: boolean;
        balance: number;
        cryptocurrency: string;
        address: string;
    }>;
}
