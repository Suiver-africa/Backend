import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from '../otp/otp.service';
import { UsersModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport'; 
import { PrismaModule } from '../prisma/prisma.module'; 
import { MailService } from '../otp/mail.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    PrismaModule,
    JwtModule.register({
      
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, MailService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
