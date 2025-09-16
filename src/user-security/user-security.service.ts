import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSecurityService {
  constructor(private prisma: PrismaService) {}

  async setPin(userId: string, pin: string) {
    const hashed = await bcrypt.hash(pin, 10);
    return this.prisma.userSecurity.upsert({
      where: { userId },
      update: { pinHash: hashed },
      create: { userId, pinHash: hashed },
    });
  }

  async verifyPin(userId: string, pin: string) {
    const sec = await this.prisma.userSecurity.findUnique({ where: { userId } });
    if (!sec) throw new UnauthorizedException('No PIN set');
    const ok = await bcrypt.compare(pin, sec.pinHash);
    if (!ok) throw new UnauthorizedException('Invalid PIN');
    return { success: true };
  }
}
