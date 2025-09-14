import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactons.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { PaymentLinksModule  } from './payment-links/payment-links.module';
// import { ReferralModule } from './referral/referral.module';
// import { UserSecurityModule } from './user-security/user-security.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
   WalletsModule,
    TransactionsModule,
    BeneficiariesModule,
     PaymentLinksModule ,
    
  ],
})
export class AppModule {}