import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBeneficiaryDto } from '../user/dto/create-beneficiary.dto';

@Injectable()
export class BeneficiariesService {
  constructor(private prisma: PrismaService) {}

  async add(userId: string, dto: CreateBeneficiaryDto) {
    const recipient = await this.prisma.user.findUnique({ where: { tag: dto.tag } });
    if (!recipient) throw new NotFoundException('Recipient not found');
    return this.prisma.beneficiary.create({ data: { userId, ...dto } });
  }

  async list(userId: string) {
    return this.prisma.beneficiary.findMany({ where: { userId } });
  }
}