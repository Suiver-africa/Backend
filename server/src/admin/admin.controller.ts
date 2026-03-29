// src/admin/admin.controller.ts
import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './guards/admin/admin.guard';

@Controller('api/admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  async getStats(@Query('period') period: string = '7days') {
    return this.adminService.getStats(period);
  }

  @Get('users')
  async getUsers(@Query('search') search?: string) {
    return this.adminService.getUsers(search);
  }

  @Get('transactions')
  async getTransactions(@Query('period') period?: string) {
    return this.adminService.getTransactions(period);
  }

  @Get('payouts')
  async getPayouts() {
    return this.adminService.getPayouts();
  }

  @Post('payouts/:id/approve')
  async approvePayout(@Param('id') id: string) {
    return this.adminService.approvePayout(id);
  }

  @Post('payouts/:id/reject')
  async rejectPayout(@Param('id') id: string) {
    return this.adminService.rejectPayout(id);
  }
}
