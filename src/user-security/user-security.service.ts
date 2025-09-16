import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserSecurityService {
  constructor(private prisma: PrismaService) {}

async setPin(userId: string, pin: string) {
  const hashedPin = await bcrypt.hash(pin, 10);

  const res = await this.prisma.userSecurity.upsert({
    where: { userId },
    update: { pinHash: hashedPin },
    create: { userId, pinHash: hashedPin },
  });

  // return minimal info
  return { success: true };
}

  async verifyPin(userId: string, pin: string) {
    const sec = await this.prisma.userSecurity.findUnique({ where: { userId } });
    if (!sec) throw new UnauthorizedException('No PIN set');
    const ok = await bcrypt.compare(pin, sec.pinHash);
    if (!ok) throw new UnauthorizedException('Invalid PIN');
    return { success: true };
  }
}
