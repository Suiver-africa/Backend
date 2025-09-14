import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentLinkDto } from '../user/dto/create-payment-link.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentLinksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreatePaymentLinkDto) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    const code = dto.openAmount ? `OPEN-${uuidv4().slice(0,8)}` : uuidv4().slice(0,8);
    return this.prisma.paymentLink.create({
      data: {
        userId,
        amount: dto.amount ? BigInt(Math.floor(dto.amount)) : null,
        openAmount: !!dto.openAmount,
        code,
      },
    });
  }
}