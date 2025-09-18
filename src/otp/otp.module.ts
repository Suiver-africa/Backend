import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailService } from './mail.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [OtpService, MailService, PrismaService],
  exports: [OtpService],
})
export class OtpModule {}
