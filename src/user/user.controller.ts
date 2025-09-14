import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './user.service';
import {
  UpdateUserDto,
  UpdateKycDto,
  UpdatePinDto,
  UpdateBiometricDto,
} from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController{
  constructor(private readonly userService:UsersService) {}

  // ─── Profile ────────────────────────────────────────────────

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.id);
  }

  @ApiOperation({ summary: 'Update user profile' })
  @Patch('profile')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Delete user account' })
  @Delete('profile')
  deleteAccount(@Request() req) {
    return this.userService.delete(req.user.id);
  }

  // ─── User Lookup ────────────────────────────────────────────

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Find user by tag' })
  @Get('tag/:tag')
  findByTag(@Param('tag') tag: string) {
    return this.userService.findByTag(tag);
  }

  // ─── KYC / Security ────────────────────────────────────────

  @ApiOperation({ summary: 'Update KYC status' })
  @Patch('kyc')
  updateKyc(@Request() req, @Body() dto: UpdateKycDto) {
    return this.userService.updateKyc(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Update PIN' })
  @Patch('pin')
  updatePin(@Request() req, @Body() dto: UpdatePinDto) {
    return this.userService.updatePin(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Update biometric setting' })
  @Patch('biometric')
  updateBiometric(@Request() req, @Body() dto: UpdateBiometricDto) {
    return this.userService.updateBiometric(req.user.id, dto);
  }

  // ─── Referrals ─────────────────────────────────────────────

  @ApiOperation({ summary: 'Get user referrals' })
  @Get('referrals/list')
  getReferrals(@Request() req) {
    return this.userService.getReferrals(req.user.id);
  }
}
