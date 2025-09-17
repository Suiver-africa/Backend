import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CryptoService {
  constructor(private prisma: PrismaService) {}

  // Lookup owner by deposit address
  async findUserByAddress(address: string) {
    const rec = await this.prisma.cryptoAddress.findUnique({ where: { address } });
    if (!rec) return null;
    return rec.userId;
  }

  // create a deposit record and process it (credit NGN after conversion)
  async processDeposit(address: string, txHash: string, amount: bigint, currency: string, rate: number, spread = 0.02) {
    const addr = await this.prisma.cryptoAddress.findUnique({ where: { address } });
    if (!addr) throw new NotFoundException('Address not found');

    // create deposit record
    const fee = BigInt(Math.floor(Number(amount) * spread)); // approximate fee in crypto units (not precise)
    const ngnAmount = BigInt(Math.floor(Number(amount) * rate * (1 - spread)));

    const deposit = await this.prisma.cryptoDeposit.create({
      data: {
        userId: addr.userId,
        txHash,
        address,
        currency,
        amount,
        ngnAmount,
        fee,
        status: 'SUCCESS',
      },
    });

    // credit user's NGN wallet
    const ngnWallet = await this.prisma.wallet.findFirst({ where: { userId: addr.userId, currency: 'NGN' } });
    if (!ngnWallet) throw new NotFoundException('NGN wallet not found');

    const newBal = ngnWallet.balance + ngnAmount;

    await this.prisma.wallet.update({
      where: { id: ngnWallet.id },
      data: { balance: newBal },
    });

    // record transaction in NGN for credit
    await this.prisma.transaction.create({
      data: {
        userId: addr.userId,
        type: 'DEPOSIT',
        amount: ngnAmount,
        currency: 'NGN',
        description: `Converted ${currency} deposit ${txHash}`,
        status: 'SUCCESS',
        fromWalletId: ngnWallet.id,
        toWalletId: ngnWallet.id,
      },
    });

    return deposit;
  }
}
