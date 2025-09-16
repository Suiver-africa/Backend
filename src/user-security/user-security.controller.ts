import { Controller, Post, Body } from '@nestjs/common';
import { UserSecurityService } from './user-security.service';
import { SetPinDto } from './dto/set-pin.dto';
import { VerifyPinDto } from './dto/verify-pin.dto';

@Controller('security')
export class UserSecurityController {
  constructor(private svc: UserSecurityService) {}

  @Post('set-pin')
  setPin(@Body() dto: SetPinDto) {
    return this.svc.setPin(dto.userId, dto.pin);
  }

  @Post('verify-pin')
  verifyPin(@Body() dto: VerifyPinDto) {
    return this.svc.verifyPin(dto.userId, dto.pin);
  }
}
