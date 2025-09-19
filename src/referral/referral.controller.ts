import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ValidateReferralCodeDto, ReferralStatsResponseDto } from './referral.dto';


@ApiTags('Referrals')
@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  // ─── Public Endpoints ──────────────────────────────────────────

  @ApiOperation({ summary: 'Validate referral code' })
  @ApiResponse({ 
    status: 200, 
    description: 'Referral code validation result',
    schema: {
      properties: {
        valid: { type: 'boolean' },
        referrer: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Invalid referral code' })
  @HttpCode(HttpStatus.OK)
  @Post('validate')
  async validateReferralCode(@Body() dto: ValidateReferralCodeDto) {
    return this.referralService.validateReferralCode(dto.referralCode);
  }

  // ─── Protected Endpoints ───────────────────────────────────────

  @ApiOperation({ summary: 'Get my referral statistics' })
  @ApiResponse({ 
    status: 200, 
    description: 'User referral statistics',
    type: ReferralStatsResponseDto 
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-stats')
  async getMyReferralStats(@Request() req) {
    return this.referralService.getUserReferralStats(req.user.id);
  }

  @ApiOperation({ summary: 'Get my referral code' })
  @ApiResponse({ 
    status: 200, 
    description: 'User referral code',
    schema: {
      properties: {
        referralCode: { type: 'string' },
        referralLink: { type: 'string' }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-code')
  async getMyReferralCode(@Request() req) {
    return this.referralService.getUserReferralCode(req.user.id);
  }

  @ApiOperation({ summary: 'Get list of my referrals' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of users referred by current user',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          status: { type: 'string' }
        }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-referrals')
  async getMyReferrals(@Request() req) {
    return this.referralService.getUserReferrals(req.user.id);
  }

  @ApiOperation({ summary: 'Get referral leaderboard' })
  @ApiResponse({ 
    status: 200, 
    description: 'Top referrers leaderboard',
    schema: {
      type: 'array',
      items: {
        properties: {
          rank: { type: 'number' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          totalReferrals: { type: 'number' },
          totalRewards: { type: 'number' }
        }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('leaderboard')
  async getReferralLeaderboard() {
    return this.referralService.getReferralLeaderboard();
  }

  @ApiOperation({ summary: 'Generate new referral code (if allowed)' })
  @ApiResponse({ 
    status: 200, 
    description: 'New referral code generated',
    schema: {
      properties: {
        referralCode: { type: 'string' },
        message: { type: 'string' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Cannot generate new code' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('generate-new-code')
  async generateNewReferralCode(@Request() req) {
    return this.referralService.generateNewReferralCode(req.user.id);
  }

  // ─── Admin Endpoints (if needed) ───────────────────────────────

  @ApiOperation({ summary: 'Get referral by code (admin)' })
  @ApiResponse({ status: 200, description: 'Referral details' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // You might want to add admin guard here
  @Get('admin/code/:code')
  async getReferralByCode(@Param('code') code: string) {
    return this.referralService.getReferralByCode(code);
  }

  @ApiOperation({ summary: 'Get user referral history (admin)' })
  @ApiResponse({ status: 200, description: 'User referral history' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // You might want to add admin guard here
  @Get('admin/user/:userId/history')
  async getUserReferralHistory(@Param('userId') userId: string) {
    return this.referralService.getUserReferralHistory(userId);
  }
}