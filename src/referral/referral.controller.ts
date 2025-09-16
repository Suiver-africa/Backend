import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReferralService } from './referral.service';

@Controller('referrals')
export class ReferralController {
  constructor(private svc: ReferralService) {}

  @Post('create/:inviterId')
  create(@Param('inviterId') inviterId: string) {
    return this.svc.createForInviter(inviterId);
  }

  @Post('use')
  use(@Body() body: { inviteeId: string; code: string }) {
    return this.svc.useCode(body.inviteeId, body.code);
  }

  @Get(':inviterId')
  list(@Param('inviterId') inviterId: string) {
    return this.svc.listByInviter(inviterId);
  }
}
