import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentLinkDto } from '../user/dto/create-payment-link.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentLinksService {
  constructor(private prisma: PrismaService) { }

  async create(userId: string, dto: CreatePaymentLinkDto) {
    // Check if user has any wallets (or specify currency if needed)
    const wallets = await this.prisma.wallet.findMany({ where: { userId } });
    if (!wallets || wallets.length === 0) {
      throw new NotFoundException('No wallets found for user');
    }

    // Generate a unique code
    const code = dto.openAmount
      ? `OPEN-${uuidv4().slice(0, 8).toUpperCase()}`
      : uuidv4().slice(0, 8).toUpperCase();

    // Create the payment link
    const paymentLink = await this.prisma.paymentLink.create({
      data: {
        userId,
        title: dto.title || 'Payment Link',
        amount: dto.amount ? dto.amount : 0,
        openAmount: !!dto.openAmount,
        code,
      },
    });

    // Return with amount as number for easier handling
    return {
      ...paymentLink,
      amount: paymentLink.amount ? Number(paymentLink.amount) : null,
    };
  }

  async findByCode(code: string) {
    const paymentLink = await this.prisma.paymentLink.findUnique({
      where: { code },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            tag: true,
          },
        },
      },
    });

    if (!paymentLink) {
      throw new NotFoundException('Payment link not found');
    }

    return {
      ...paymentLink,
      amount: paymentLink.amount ? Number(paymentLink.amount) : null,
    };
  }

  async findByUserId(userId: string) {
    const paymentLinks = await this.prisma.paymentLink.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return paymentLinks.map(link => ({
      ...link,
      amount: link.amount ? Number(link.amount) : null,
    }));
  }

  async delete(userId: string, id: number) {
    // Ensure the payment link belongs to the user
    const paymentLink = await this.prisma.paymentLink.findFirst({
      where: { id, userId },
    });

    if (!paymentLink) {
      throw new NotFoundException('Payment link not found or does not belong to user');
    }

    await this.prisma.paymentLink.delete({
      where: { id },
    });

    return { success: true, message: 'Payment link deleted successfully' };
  }

  async update(userId: string, id: number, dto: Partial<CreatePaymentLinkDto>) {
    // Ensure the payment link belongs to the user
    const existingLink = await this.prisma.paymentLink.findFirst({
      where: { id, userId },
    });

    if (!existingLink) {
      throw new NotFoundException('Payment link not found or does not belong to user');
    }

    const updatedLink = await this.prisma.paymentLink.update({
      where: { id },
      data: {
        ...(dto.amount && { amount: dto.amount }),
        ...(dto.openAmount !== undefined && { openAmount: !!dto.openAmount }),
      },
    });

    return {
      ...updatedLink,
      amount: updatedLink.amount ? Number(updatedLink.amount) : null,
    };
  }

  // Alternative: If you want to check for a specific currency wallet
  async createWithCurrency(userId: string, dto: CreatePaymentLinkDto, currency: string = 'NGN') {
    // Check if user has a wallet for the specific currency
    const wallet = await this.prisma.wallet.findUnique({
      where: {
        userId_cryptocurrency: {
          userId,
          cryptocurrency: currency,
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet for ${currency} not found`);
    }

    const code = dto.openAmount
      ? `OPEN-${uuidv4().slice(0, 8).toUpperCase()}`
      : uuidv4().slice(0, 8).toUpperCase();

    const paymentLink = await this.prisma.paymentLink.create({
      data: {
        userId,
        amount: dto.amount ? dto.amount : 0,
        openAmount: !!dto.openAmount,
        title: dto.title || 'Payment Link',
        code,
      },
    });

    return {
      ...paymentLink,
      amount: paymentLink.amount ? Number(paymentLink.amount) : null,
    };
  }
}