import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from '../otp/otp.service';
import { UsersModule } from '../user/user.module'; 
import { PrismaModule } from '../../prisma/prisma.module'; 
import { MailService } from '../otp/mail.service';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
