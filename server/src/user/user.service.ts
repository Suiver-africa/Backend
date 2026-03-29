import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KycStatus } from '@prisma/client';
import { CreateUserDto, LoginDto } from './dto/auth.dto';
import {
  UpdateUserDto,
  UpdateKycDto,
  UpdatePinDto,
  UpdateBiometricDto,
} from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { KycDto } from './dto/kyc.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // ---------------- AUTH ----------------
  async signup(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const tag = uuidv4().split('-')[0];

    try {
      const data: any = {
        email: dto.email,
        password: hashed,
        tag,
        firstName: dto.firstName,
        lastName: dto.lastName,
      };

      if (dto.phone) data.phone = dto.phone;

      if (dto.referredByCode) {
        const ref = await this.prisma.user.findUnique({
          where: { referralCode: dto.referredByCode },
        });
        if (ref) data.referredById = ref.id;
      }

      const user = await this.prisma.user.create({ data });

      // create wallets for multiple currencies (NGN + common cryptos)
      const currencies = [
        'NGN',
        'BTC',
        'ETH',
        'BNB',
        'LTC',
        'SUI',
        'SOL',
        'USDT',
      ];
      for (const cur of currencies) {
        await this.prisma.wallet.create({
          data: {
            userId: user.id,
            balance: 0,
            currency: cur,
          },
        });
        // create a deposit address for crypto currencies (not for NGN)
        if (cur !== 'NGN') {
          const addr = `suiver_${cur.toLowerCase()}_${uuidv4().split('-')[0]}`;
          await this.prisma.cryptoAddress.create({
            data: { userId: user.id, currency: cur, chain: cur, address: addr },
          });
        }
      }
      const token = this.jwtService.sign({ sub: user.id });
      return { user, token };
    } catch (e: any) {
      if (e.code === 'P2002')
        throw new BadRequestException('Unique constraint failed');
      throw e;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new BadRequestException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id });
    return { user, token };
  }

  // ---------------- USER MGMT ----------------
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        wallets: true,
        referrals: true,
        referredBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByTag(tag: string) {
    return this.prisma.user.findUnique({
      where: { tag },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        tag: true,
        email: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.tag) {
      const existing = await this.prisma.user.findUnique({
        where: { tag: dto.tag },
      });
      if (existing && existing.id !== id)
        throw new ConflictException('Tag already exists');
    }

    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        tag: true,
        kycStatus: true,
        biometricEnabled: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateKyc(id: string, dto: UpdateKycDto) {
    return this.prisma.user.update({
      where: { id },
      data: { kycStatus: dto.kycStatus as KycStatus },
      select: { id: true, kycStatus: true },
    });
  }

  async updatePin(id: string, dto: UpdatePinDto) {
    const hashedPin = await bcrypt.hash(dto.pin, 10);

    await this.prisma.userSecurity.upsert({
      where: { userId: id },
      update: { pinHash: hashedPin },
      create: { userId: id, pinHash: hashedPin },
    });
    return { success: true };
  }

  async updateBiometric(id: string, dto: UpdateBiometricDto) {
    return this.prisma.user.update({
      where: { id },
      data: { biometricEnabled: dto.biometricEnabled },
      select: { id: true, biometricEnabled: true },
    });
  }

  async setUserTag(userId: string, desiredTag: string) {
    const clean = desiredTag.startsWith('@') ? desiredTag.slice(1) : desiredTag;
    if (!/^[a-zA-Z0-9._]{4,20}$/.test(clean)) {
      throw new BadRequestException('Invalid tag format');
    }
    const existing = await this.prisma.user.findUnique({
      where: { tag: clean },
    });
    if (existing) throw new BadRequestException('Tag taken');

    return this.prisma.user.update({
      where: { id: userId },
      data: { tag: clean },
      select: { id: true, tag: true },
    });
  }

  async submitKyc(userId: string, _dto: KycDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { kycStatus: KycStatus.PENDING },
      select: { id: true, kycStatus: true },
    });
  }

  async getReferrals(id: string) {
    return this.prisma.user.findMany({
      where: { referredById: id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
