import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { KycDto } from './dto/kyc.dto';
import { DepositDto, WithdrawDto, SendDto } from './dto/wallet.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

import { CreatePaymentLinkDto } from './dto/create-payment-link.dto';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  /** ----------------- AUTH & USER ----------------- */
  async signup(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const tag = uuidv4().split('-')[0]; // temporary unique tag

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        tag,
      },
    });

    // Auto-create wallet
    await this.prisma.wallet.create({ data: { userId: user.id, balance: 0 } });

    // Return JWT
    const token = this.jwtService.sign({ sub: user.id });
    return { user, token };
  }

  async login(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id });
    return { user, token };
  }

  /** ----------------- WALLET & TRANSACTIONS ----------------- */
  async deposit(userId: string, amount: number) {
    const wallet = await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await this.prisma.transaction.create({
      data: { userId, type: 'DEPOSIT', amount, description: 'Crypto conversion', fromWalletId: wallet.id, toWalletId: wallet.id, currency: wallet.currency, status: 'success' },
    });

    return wallet;
  }
async sendMoney(senderId: string, dto: SendDto) {
  const { recipientId, amount } = dto;

  const senderWallet = await this.prisma.wallet.findUnique({ where: { userId: senderId } });
  if (!senderWallet || senderWallet.balance < amount) throw new Error('Insufficient balance');

  const recipient = await this.prisma.user.findUnique({ where: { id: recipientId } });
  if (!recipient) throw new Error('Recipient not found');

  // Deduct sender
  await this.prisma.wallet.update({
    where: { userId: senderId },
    data: { balance: { decrement: amount } },
  });

  // Credit recipient
  await this.prisma.wallet.update({
    where: { userId: recipient.id },
    data: { balance: { increment: amount } },
  });

  // Record transactions
  await this.prisma.transaction.createMany({
    data: [
      { userId: senderId, type: 'SEND', amount, description: `Sent to ${recipient.tag}`, fromWalletId: senderWallet.id, toWalletId: senderWallet.id, currency: senderWallet.currency, status: 'success' },
      { userId: recipient.id, type: 'RECEIVE', amount, description: `Received from ${senderWallet.userId}`, fromWalletId: senderWallet.id, toWalletId: senderWallet.id, currency: senderWallet.currency, status: 'success' },
    ],
  });

  return { success: true };
}


  /** ----------------- TRANSACTIONS ----------------- */
async createTransaction(userId: string, dto: CreateTransactionDto) {
  const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error('Wallet not found');

  if (dto.type === 'send') {
    return this.sendMoney(userId, dto.recipientId, dto.amount);
  }

  if (dto.type === 'withdraw') {
    return this.withdraw(userId, { amount: dto.amount, currency: 'NGN', destinationAccount: dto.reference });
  }

  if (dto.type === 'request') {
    return this.prisma.transaction.create({
      data: {
        userId,
        type: 'REQUEST',
        amount: dto.amount,
        description: `Requested from ${dto.recipientId}`,
        fromWalletId: wallet.id,
        toWalletId: wallet.id,
        currency: wallet.currency,
        status: 'pending',
      },
    });
  }

    if (dto.type === 'deposit') {
    return this.deposit(userId, dto.amount);
    }

  throw new Error('Invalid transaction type');
}

async listTransactions(userId: string) {
  return this.prisma.transaction.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

/** ----------------- PAYMENT LINK ----------------- */
async createPaymentLink(userId: string, dto: CreatePaymentLinkDto) {
  const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw new Error('Wallet not found');

  const link = await this.prisma.paymentLink.create({
    data: {
      userId,
      amount: dto.amount,
      currency: wallet.currency,
      description: dto.description,
      redirectUrl: dto.redirectUrl,
      status: 'active',
      link: `https://suiver.app/pay/${uuidv4()}`,
    },
  });

  return link;
}
  /** ----------------- WALLET: WITHDRAW ----------------- */
async withdraw(userId: string, dto: WithdrawDto) {
  const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
  if (!wallet || wallet.balance < dto.amount) throw new Error('Insufficient balance');

  await this.prisma.wallet.update({
    where: { userId },
    data: { balance: { decrement: dto.amount } },
  });

  await this.prisma.transaction.create({
    data: {
      userId,
      type: 'WITHDRAW',
      amount: dto.amount,
      description: `Withdrawal to ${dto.destinationAccount}`,
      fromWalletId: wallet.id,
      toWalletId: wallet.id,
      currency: wallet.currency,
      status: 'pending', // maybe approve manually or via external API
    },
  });

  return { success: true };
}

  /** ----------------- KYC & TAG ----------------- */
  async submitKyc(userId: string, dto: KycDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'PENDING' }, // Ideally store document reference here
    });
  }

  async setUserTag(userId: string, desiredTag: string) {
    const cleanTag = desiredTag.startsWith('@') ? desiredTag.slice(1) : desiredTag;

    if (!/^[a-zA-Z0-9._]{4,20}$/.test(cleanTag)) throw new Error('Invalid tag format');

    const existing = await this.prisma.user.findUnique({ where: { tag: cleanTag } });
    if (existing) throw new Error('Tag already taken');

    return this.prisma.user.update({ where: { id: userId }, data: { tag: cleanTag } });
  }

  /** ----------------- BENEFICIARIES ----------------- */
  async addBeneficiary(userId: string, dto: CreateBeneficiaryDto) {
    const recipient = await this.prisma.user.findUnique({ where: { tag: dto.tag } });
    if (!recipient) throw new Error('Recipient not found');

    return this.prisma.beneficiary.create({ data: { userId, ...dto } });
  }

  async listBeneficiaries(userId: string) {
    return this.prisma.beneficiary.findMany({ where: { userId } });
  }
}
