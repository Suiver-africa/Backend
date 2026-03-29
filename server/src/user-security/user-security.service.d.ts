import { PrismaService } from '../prisma/prisma.service';
export declare class UserSecurityService {
    private prisma;
    constructor(prisma: PrismaService);
    setPin(userId: string, pin: string): Promise<{
        success: boolean;
    }>;
    verifyPin(userId: string, pin: string): Promise<{
        success: boolean;
    }>;
}
