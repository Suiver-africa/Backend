import { PrismaService } from '../../prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { CryptoService } from '../crypto/crypto.service';
import { ConfigService } from '@nestjs/config';
import { VTPassService } from './providers/vtpass.service';
@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private cryptoService: CryptoService,
    private configService: ConfigService,
    private prisma: PrismaService,
    private vtPassService: VTPassService,
  ) { }

  // Airtime purchase convenience method
  async buyAirtime(userId: string, phone: string, amount: number) {
    // Map to VTPass service provider
    const provider = 'mtn'; // Default for MVP, can be dynamic
    return this.payBill(userId, 'AIRTIME', amount, phone, provider);
  }

  // Process crypto to Naira conversion
  async processCryptoToNaira(
    userId: string,
    cryptocurrency: string,
    amount: number,
    walletAddress: string
  ): Promise<any> {
    try {
      // 1. Get user's wallet
      const wallet = await this.prisma.wallet.findFirst({
        where: {
          userId,
          currency: cryptocurrency.toUpperCase(),
          address: walletAddress,
          isActive: true
        }
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // 2. Verify wallet balance
      const balance = await this.cryptoService.getWalletBalance(walletAddress, cryptocurrency);
      if (balance < amount) {
        throw new Error('Insufficient balance');
      }

      // 3. Get conversion rate
      const { nairaAmount, exchangeRate } = await this.cryptoService.convertCryptoToNaira(amount, cryptocurrency);

      // 4. Calculate fees (2% conversion fee)
      const conversionFee = nairaAmount * 0.02;
      const finalAmount = nairaAmount - conversionFee;

      // 5. Create transaction record using your existing Transaction model
      const transaction = await this.prisma.transaction.create({
        data: {
          userId,
          type: 'CRYPTO_TO_NAIRA',
          amount: BigInt(Math.round(finalAmount * 100)), // Store as smallest unit
          currency: 'NGN',
          cryptocurrency: cryptocurrency.toUpperCase(),
          cryptoAmount: amount,
          nairaAmount: finalAmount,
          exchangeRate,
          status: 'PENDING',
          fromAddress: walletAddress,
          description: `Convert ${amount} ${cryptocurrency.toUpperCase()} to NGN`,
          metadata: {
            conversionFee,
            originalAmount: nairaAmount,
            exchangeRate
          }
        }
      });

      // 6. Update wallet balances
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: { decrement: amount },
          nairaBalance: { increment: finalAmount }
        }
      });

      return {
        success: true,
        transactionId: transaction.id,
        nairaAmount: finalAmount,
        conversionFee,
        exchangeRate,
        estimatedTime: '5-10 minutes'
      };

    } catch (error) {
      this.logger.error('Crypto to Naira conversion failed:', error);
      throw error;
    }
  }

  // Bill Payment Integration
  async payBill(
    userId: string,
    billType: string,
    amount: number,
    accountNumber: string,
    provider?: string
  ): Promise<any> {
    try {
      // Check user's Naira balance across all wallets
      const totalNairaBalance = await this.prisma.wallet.aggregate({
        where: { userId, isActive: true },
        _sum: { nairaBalance: true }
      });

      const totalBalance = totalNairaBalance._sum.nairaBalance?.toNumber() || 0;
      if (totalBalance < amount) {
        throw new Error('Insufficient Naira balance');
      }

      // Create bill payment transaction
      const transaction = await this.prisma.transaction.create({
        data: {
          userId,
          type: 'BILL_PAYMENT',
          amount: BigInt(Math.round(amount * 100)),
          currency: 'NGN',
          nairaAmount: amount,
          status: 'PENDING',
          description: `${billType} bill payment - ${accountNumber}`,
          metadata: {
            billType,
            accountNumber,
            provider
          }
        }
      });

      // Process bill payment (integrated with VTPass)
      const result = await this.processBillPayment({
        userId,
        billType,
        amount,
        accountNumber,
        provider,
        transactionId: transaction.id
      });

      // Update transaction status
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: result.code === '000' ? 'COMPLETED' : 'FAILED',
          hash: result.requestId
        }
      });

      return {
        success: result.code === '000',
        transactionId: transaction.id,
        status: result.code === '000' ? 'successful' : 'failed',
        reference: result.requestId,
        details: result.content
      };

    } catch (error) {
      this.logger.error('Bill payment failed:', error);
      throw error;
    }
  }

  private async processBillPayment(data: any): Promise<any> {
    if (data.billType === 'AIRTIME') {
      return this.vtPassService.purchaseAirtime(data.accountNumber, data.amount, data.provider || 'mtn');
    }
    // Mock simulation for other types
    return {
      code: '000',
      requestId: `MOCK-${Date.now()}`,
      content: { status: 'successful' }
    };
  }

  // Money Transfer using your existing schema
  async transferMoney(
    fromUserId: string,
    toIdentifier: string, // email, phone, or tag
    amount: number,
    message?: string
  ): Promise<any> {
    try {
      // 1. Find recipient by email, phone, or tag
      let toUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: toIdentifier },
            { phone: toIdentifier },
            { tag: toIdentifier }
          ]
        }
      });

      if (!toUser) {
        // Create transfer request if user not found
        const transferRequest = await this.prisma.transferRequest.create({
          data: {
            fromUserId,
            toEmail: toIdentifier.includes('@') ? toIdentifier : undefined,
            toPhone: !toIdentifier.includes('@') ? toIdentifier : undefined,
            amount,
            message,
            status: 'pending'
          }
        });

        return {
          success: true,
          type: 'request_created',
          transferRequestId: transferRequest.id,
          message: 'Transfer request created. Recipient will be notified.'
        };
      }

      // 2. Process immediate transfer
      const senderTransaction = await this.prisma.transaction.create({
        data: {
          userId: fromUserId,
          type: 'TRANSFER',
          amount: BigInt(Math.round(amount * 100)),
          currency: 'NGN',
          nairaAmount: amount,
          status: 'COMPLETED',
          description: `Transfer to ${toUser.firstName || toUser.email}`,
          metadata: { recipientId: toUser.id, message }
        }
      });

      const receiverTransaction = await this.prisma.transaction.create({
        data: {
          userId: toUser.id,
          type: 'RECEIVE',
          amount: BigInt(Math.round(amount * 100)),
          currency: 'NGN',
          nairaAmount: amount,
          status: 'COMPLETED',
          description: `Received from ${fromUserId}`,
          metadata: { senderId: fromUserId, message }
        }
      });

      return {
        success: true,
        type: 'transfer_completed',
        transactionId: senderTransaction.id,
        recipientInfo: {
          name: toUser.firstName || toUser.email,
          identifier: toIdentifier
        }
      };

    } catch (error) {
      this.logger.error('Money transfer failed:', error);
      throw error;
    }
  }

  // Create Payment Link using your existing PaymentLink model
  async createPaymentLink(
    userId: string,
    title: string,
    amount: number,
    description?: string,
    expiresAt?: Date
  ): Promise<any> {
    try {
      const code = `pl_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const paymentLink = await this.prisma.paymentLink.create({
        data: {
          userId,
          title,
          description,
          amount,
          currency: 'NGN',
          code,
          expiresAt,
          isActive: true,
          openAmount: false
        }
      });

      const linkUrl = `${this.configService.get('FRONTEND_URL') || 'https://suiverafica.vercel.app/'}/pay/${code}`;

      return {
        success: true,
        paymentLink: linkUrl,
        linkId: paymentLink.id,
        code: paymentLink.code,
        qrCode: `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" font-size="12">QR Code for ${linkUrl}</text></svg>`).toString('base64')}`
      };

    } catch (error) {
      this.logger.error('Payment link creation failed:', error);
      throw error;
    }
  }

  // Generate wallet and save to your existing Wallet model
  async createUserWallet(userId: string, cryptocurrency: string): Promise<any> {
    try {
      // Check if wallet already exists
      const existingWallet = await this.prisma.wallet.findUnique({
        where: {
          userId_currency: {
            userId,
            currency: cryptocurrency.toUpperCase()
          }
        }
      });

      if (existingWallet) {
        return {
          success: true,
          wallet: {
            address: existingWallet.address,
            currency: existingWallet.currency
          },
          message: 'Wallet already exists'
        };
      }

      // Generate new wallet
      const walletData = await this.cryptoService.generateWallet(cryptocurrency);

      // Encrypt private key (in production, use proper encryption)
      const encryptedPrivateKey = Buffer.from(walletData.privateKey).toString('base64');

      // Save to database
      const wallet = await this.prisma.wallet.create({
        data: {
          userId,
          currency: cryptocurrency.toUpperCase(),
          address: walletData.address,
          privateKey: encryptedPrivateKey,
          publicKey: walletData.publicKey,
          balance: 0,
          nairaBalance: 0,
          isActive: true
        }
      });

      return {
        success: true,
        wallet: {
          id: wallet.id,
          address: wallet.address,
          cryptocurrency: wallet.currency,
          balance: wallet.balance.toNumber()
        }
      };

    } catch (error) {
      this.logger.error('Wallet creation failed:', error);
      throw error;
    }
  }
}