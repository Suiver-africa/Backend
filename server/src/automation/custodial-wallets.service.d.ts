import { PrismaService } from '../prisma/prisma.service';
export declare class CustodialWalletsService {
    private prisma;
    private logger;
    constructor(prisma: PrismaService);
    getByAddress(address: string): Promise<any>;
    createAddress(userId: string, chain: string, address: string): Promise<any>;
    listAddressesForUser(userId: string): Promise<any>;
}
