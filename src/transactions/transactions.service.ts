
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class TransactionsService {
  constructor(
    private prisma: PrismaService,
    private cryptoService: CryptoService
  ) { }

  private async getWallet(userId: string, currency = 'NGN') {
    const wallet = await this.prisma.wallet.findFirst({ where: { userId, cryptocurrency: currency } });
    if (!wallet) throw new NotFoundException('Wallet not found for currency ' + currency);
    return wallet;
  }
  //payment gateway integration pending
  private async getDailyOutgoingNgN(userId: string) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const txs = await this.prisma.transaction.findMany({
      where: {
        userId,
        currency: 'NGN',
        type: { in: ['CRYPTO_TO_NAIRA', 'WITHDRAW'] },
        createdAt: { gte: since },
      },
      select: { amount: true },
    });
    let sum = BigInt(0);
    for (const t of txs) sum += BigInt(t.amount as any);
    return sum;
  }

  private async userDailyLimit(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.kycStatus === 'APPROVED') return BigInt(40000000); // 40,000,000 NGN
    return BigInt(100000); // 100,000 NGN for non-KYC
  }

  async deposit(userId: string, amount: number, currency = 'NGN') {
    // Credit user's wallet for the 'currency' (typically NGN)
    // Using Decimal for balance

    // Check if currency is NGN, use nairaBalance, else balance?
    // Schema has `balance` (20,8) and `nairaBalance` (15,2).
    // Assuming 'balance' is for the specific cryptocurrency, and 'nairaBalance' is fiat.
    // However, if currency IS 'NGN', do we use `balance` or `nairaBalance`?
    // Existing code logic seemed to use `balance`.
    // Let's assume for NGN, we use `nairaBalance` if `currency === 'NGN'`, OR if `cryptocurrency` field stores 'NGN', maybe `balance` is used?
    // Let's look at schema defaults.
    // For safety, knowing User Wallet Model:
    // If currency is 'NGN', likely we want `nairaBalance`.
    // But `Wallet` has `cryptocurrency` field.
    // If I create a wallet with `cryptocurrency='NGN'`, I should probably use `nairaBalance`?
    // Or maybe `balance` is generic?
    // Looking at `processDeposit` I wrote: I updated `nairaBalance` to increment.
    // Let's stick to updating `balance` for generic deposit if it's not strictly specified, 
    // OR BETTER: Update `nairaBalance` if NGN, `balance` if crypto.

    const wallet = await this.getWallet(userId, currency);

    // Create payload
    const data: any = {};
    if (currency === 'NGN') {
      data.nairaBalance = { increment: amount };
    } else {
      data.balance = { increment: amount };
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: data,
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'DEPOSIT',
          amount: BigInt(Math.floor(amount)),
          nairaAmount: currency === 'NGN' ? amount : 0, // Required field

          description: 'Deposit',
          currency: wallet.cryptocurrency,
          status: 'COMPLETED', // Enum is COMPLETED, not SUCCESS? Schema says TransactionStatus (PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED)
          // Original code said 'SUCCESS'. I need to change to 'COMPLETED'.

          fromWalletId: wallet.id,
          toWalletId: wallet.id,
        },
      }),
    ]);

    return updated;
  }

  async send(userId: string, recipientTag: string, amount: number, currency = 'NGN') {
    const senderWallet = await this.getWallet(userId, currency);

    // Check Balance (Decimal comparison)
    // wallet.balance is Decimal.
    const balance = currency === 'NGN' ? senderWallet.nairaBalance : senderWallet.balance;
    if (Number(balance) < amount) throw new BadRequestException('Insufficient balance');

    // Enforce daily limit for NGN flows
    if (currency === 'NGN') {
      const limit = await this.userDailyLimit(userId);
      const used = await this.getDailyOutgoingNgN(userId);
      if (used + BigInt(Math.floor(amount)) > limit) throw new BadRequestException('Daily limit exceeded');
    }

    const recipient = await this.prisma.user.findUnique({ where: { tag: recipientTag } });
    if (!recipient) throw new NotFoundException('Recipient not found');
    const recipientWallet = await this.getWallet(recipient.id, currency);

    // Update Data
    const senderUpdate = currency === 'NGN' ? { nairaBalance: { decrement: amount } } : { balance: { decrement: amount } };
    const recipientUpdate = currency === 'NGN' ? { nairaBalance: { increment: amount } } : { balance: { increment: amount } };

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: senderWallet.id },
        data: senderUpdate,
      }),
      this.prisma.wallet.update({
        where: { id: recipientWallet.id },
        data: recipientUpdate,
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'TRANSFER', // Enum has TRANSFER? Yes.
          amount: BigInt(Math.floor(amount)),
          nairaAmount: currency === 'NGN' ? amount : 0,
          description: `Sent to ${recipient.tag}`,
          currency: senderWallet.cryptocurrency,
          status: 'COMPLETED',
          fromWalletId: senderWallet.id,
          toWalletId: recipientWallet.id,
        },
      }),
      this.prisma.transaction.create({
        data: {
          userId: recipient.id,
          type: 'RECEIVE',
          amount: BigInt(Math.floor(amount)),
          nairaAmount: currency === 'NGN' ? amount : 0,
          description: `Received from ${userId}`,
          currency: recipientWallet.cryptocurrency,
          status: 'COMPLETED',
          fromWalletId: senderWallet.id,
          toWalletId: recipientWallet.id,
        },
      }),
    ]);

    return { success: true };
  }

  async withdraw(userId: string, amount: number, destinationAccount: string, currency = 'NGN') {
    const wallet = await this.getWallet(userId, currency);

    // Check Balance
    const balance = currency === 'NGN' ? wallet.nairaBalance : wallet.balance;
    if (Number(balance) < amount) throw new BadRequestException('Insufficient balance');

    // Enforce daily limit for NGN flows
    if (currency === 'NGN') {
      const limit = await this.userDailyLimit(userId);
      const used = await this.getDailyOutgoingNgN(userId);
      if (used + BigInt(Math.floor(amount)) > limit) throw new BadRequestException('Daily limit exceeded');
    }

    // Since it's WITHDRAW, we assume we debit now? Or is PENDING status meaning we lock funds?
    // Original code didn't debit wallet, just created Transaction PENDING.
    // I should probably hold funds?
    // For now, mirroring original behavior but fixing types:
    // Actually, original: `const newBal = wallet.balance - parsed;` (Line 132) - wait, it calculated newBal but didn't use it in `$transaction`?
    // Line 134 started `$transaction`? No, original line 134 was `this.prisma.transaction.create`. It didn't update wallet!
    // That's a bug in original code (calculating newBal but not saving it).
    // I should probably Debit the wallet here.

    const updateData = currency === 'NGN' ? { nairaBalance: { decrement: amount } } : { balance: { decrement: amount } };

    await this.prisma.$transaction([
      this.prisma.wallet.update({
        where: { id: wallet.id },
        data: updateData
      }),
      this.prisma.transaction.create({
        data: {
          userId,
          type: 'WITHDRAW',
          amount: BigInt(Math.floor(amount)),
          nairaAmount: currency === 'NGN' ? amount : 0,
          description: `Withdraw to ${destinationAccount}`,
          currency: wallet.cryptocurrency,
          status: 'PENDING',
          fromWalletId: wallet.id,
          toWalletId: wallet.id,
        },
      })
    ]);

    return { success: true };
  }

  // --- Crypto Deposit Logic ---

  async processDeposit(
    toAddress: string,
    amount: number,
    currency: string,
    txHash: string,
    fromAddress: string
  ) {
    // 1. Idempotency Check
    const existingDeposit = await this.prisma.cryptoDeposit.findUnique({
      where: { txHash },
    });

    if (existingDeposit) {
      console.log(`Deposit ${txHash} already processed.`);
      return;
    }

    // 2. Find User Wallet by Address
    // We assume the user has a wallet with this address registered for this currency
    // Or we look up the CryptoAddress table if we separate them.
    // For MVP, checking the Wallet table directly as per Schema:

    // Note: We search by address. In a real app, case sensitivity on EVM addresses matters.
    // We'll normalize to lowercase if needed, but for now assuming strict match or handling elsewhere.
    const userWallet = await this.prisma.wallet.findFirst({
      where: {
        address: toAddress,
        // We might want to filter by currency too, but address should be unique enough usually
      },
      include: { user: true }
    });

    if (!userWallet) {
      console.warn(`Deposit received for unknown address: ${toAddress}`);
      return;
    }

    // 3. Get Conversion Rate
    const { nairaAmount, exchangeRate } = await this.cryptoService.convertCryptoToNaira(amount, currency);
    console.log(`Processing deposit: ${amount} ${currency} -> ${nairaAmount} NGN for user ${userWallet.userId}`);

    // 4. Double-Entry Accounting
    // Credit User NGN
    // Debit System Float NGN (We need a System User/Wallet for this)

    const SYSTEM_FLOAT_USER_ID = 'SYSTEM_FLOAT'; // Ideally from Config
    // Ensure System Wallet Exists (Simplification for MVP: We might just create it if missing)
    let systemWallet = await this.prisma.wallet.findFirst({
      where: { userId: SYSTEM_FLOAT_USER_ID, cryptocurrency: 'NGN' }
    });

    if (!systemWallet) {
      // Create it if it doesn't exist (Lazy initialization for MVP)
      // We need to ensure the user exists first.
      const systemUser = await this.prisma.user.upsert({
        where: { email: 'system@suiver.com' },
        update: {},
        create: {
          email: 'system@suiver.com',
          password: 'hashed_secure_password', // Should be properly handled
          firstName: 'System',
          lastName: 'Float',
          id: SYSTEM_FLOAT_USER_ID
        }
      });

      systemWallet = await this.prisma.wallet.create({
        data: {
          userId: systemUser.id,
          cryptocurrency: 'NGN',
          address: 'internal_system_float',
          publicKey: 'internal_system_float',
          balance: 1000000000, // Pre-funded Float for MVP simulation
        }
      });
    }

    // Database Transaction
    await this.prisma.$transaction([
      // Record Deposit Event
      this.prisma.cryptoDeposit.create({
        data: {
          userId: userWallet.userId,
          txHash,
          address: toAddress,
          currency,
          amount: BigInt(Math.floor(amount * 1e8)), // Storing as integer (satoshis/wei-like)
          ngnAmount: BigInt(Math.floor(nairaAmount * 100)), // Storing as kobo
          fee: BigInt(0),
          status: 'COMPLETED'
        }
      }),

      // Credit User NGN Wallet
      // We find their NGN wallet, or create if doesn't exist (though usually they should have one)
      // For simplicity, let's assume they have one, or use the same wallet record if it handles NGN balance
      // The Schema has `nairaBalance` on the Wallet model, let's use that.
      this.prisma.wallet.update({
        where: { id: userWallet.id },
        data: {
          nairaBalance: { increment: nairaAmount }
        }
      }),

      // Debit System Float
      this.prisma.wallet.update({
        where: { id: systemWallet.id },
        data: {
          balance: { decrement: nairaAmount } // Assuming System Wallet uses 'balance' for NGN since currency is NGN
        }
      }),

      // Create Transaction Records
      this.prisma.transaction.create({
        data: {
          userId: userWallet.userId,
          type: 'CRYPTO_TO_NAIRA',
          amount: BigInt(Math.floor(nairaAmount)),
          nairaAmount: nairaAmount,
          exchangeRate: exchangeRate,
          currency: 'NGN',
          status: 'COMPLETED',
          description: `Converted ${amount} ${currency} to NGN`,
          hash: txHash,
          toWalletId: userWallet.id,
          fromWalletId: systemWallet.id // Meaning it came from System Liquidity
        }
      })
    ]);

    console.log(`Deposit Processed Successfully: ${txHash}`);
    return true;
  }
}