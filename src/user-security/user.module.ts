import { Module } from '@nestjs/common';
import { UserSecurityService } from './user-security.service';
import { UserSecurityController } from './user-security.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserSecurityService],
  controllers: [UserSecurityController],
  exports: [UserSecurityService],
})
export class UserSecurityModule {}