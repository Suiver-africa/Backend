// src/admin/admin.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    PrismaModule,
    PaymentsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' }
    })
  ],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }