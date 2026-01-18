import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * CustodialWalletsService
 * - Simple helper to map user -> custodial public addresses (read-only for users).
 * - Expects prisma model CryptoAddress to exist; this service will create or fetch addresses.
 */
@Injectable()
export class CustodialWalletsService {
  private logger = new Logger(CustodialWalletsService.name);
  constructor(private prisma: PrismaService) { }

  async getByAddress(address: string) {
    return this.prisma.cryptoAddress.findUnique({ where: { address } });
  }

  async createAddress(userId: string, chain: string, address: string) {
    return this.prisma.cryptoAddress.create({
      data: { userId, chain, address, currency: chain }
    });
  }

  async listAddressesForUser(userId: string) {
    return this.prisma.cryptoAddress.findMany({ where: { userId } });
  }
}
