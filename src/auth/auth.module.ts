import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthService } from './auth.service';
import { OtpService } from './otp.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'changeme'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_ACCESS_TOKEN_EXPIRY', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 3,
    }),
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    OtpService,
    JwtStrategy, 
    JwtAuthGuard,
  ],
  exports: [
    AuthService, 
    OtpService,
    JwtAuthGuard,
  ],
})
export class AuthModule {}