import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthController } from './user.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { OtpService } from '../otp/otp.service';
import { MailModule } from '../otp/mail.module'; 

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),MailModule
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService, OtpService, PrismaService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}

