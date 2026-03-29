import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { ConfigService } from '@nestjs/config';
import { VTPassService } from './providers/vtpass.service';
export declare class PaymentsService {
    private cryptoService;
    private configService;
    private prisma;
    private vtPassService;
    private readonly logger;
    constructor(cryptoService: CryptoService, configService: ConfigService, prisma: PrismaService, vtPassService: VTPassService);
    buyAirtime(userId: string, phone: string, amount: number): Promise<any>;
    processCryptoToNaira(userId: string, cryptocurrency: string, amount: number, walletAddress: string): Promise<any>;
    payBill(userId: string, billType: string, amount: number, accountNumber: string, provider?: string): Promise<any>;
    private processBillPayment;
    transferMoney(fromUserId: string, toIdentifier: string, amount: number, message?: string): Promise<any>;
    createPaymentLink(userId: string, title: string, amount: number, description?: string, expiresAt?: Date): Promise<any>;
    createUserWallet(userId: string, cryptocurrency: string): Promise<any>;
}
