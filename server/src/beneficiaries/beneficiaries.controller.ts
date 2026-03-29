import { Controller, Post, UseGuards, Req, Body, Get } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateBeneficiaryDto } from '../user/dto/create-beneficiary.dto';

@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(private svc: BeneficiariesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  add(@Req() req, @Body() dto: CreateBeneficiaryDto) {
    return this.svc.add(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  list(@Req() req) {
    return this.svc.list(req.user.id);
  }
}
