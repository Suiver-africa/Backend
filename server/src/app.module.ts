import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/user.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { PaymentLinksModule } from './payment-links/payment-links.module';
// import { ReferralModule } from './referral/referral.module';
// import { UserSecurityModule } from './user-security/user-security.module';
import { AuthModule } from './auth/auth.module';
import { ReferralModule } from './referral/referral.module';
import { PaymentsModule } from './payments/payments.module';
import { MailModule } from './otp/mail.module';
import { UserSecurityModule } from './user-security/user.module';
import { OtpModule } from './otp/otp.module';
import { CryptoModule } from './crypto/crypto.module';
import { AutomationModule } from './automation/automation.module';
import { AdminModule } from './admin/admin.module';
import { ListenerModule } from './listener/listener.module';

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
    PaymentLinksModule,
    ReferralModule,
    PaymentsModule,
    MailModule,
    UserSecurityModule,
    OtpModule,
    CryptoModule,
    AutomationModule,
    AdminModule,
    ListenerModule,
  ],
})
export class AppModule {}
