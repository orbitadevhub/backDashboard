import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TwoFactorAuthService } from './twofactor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../auth/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('2fa')
export class TwoFactorController {
  constructor(private twoFAService: TwoFactorAuthService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)

  @Get('generate')
  async generate2FA(@Req() req) {
    const user = req.user;
    return this.twoFAService.generateSecret(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable')
  async enable2FA(@Req() req, @Body() body) {
    const user = req.user;
    const { code } = body;
    return this.twoFAService.enable2FA(user, code);
  }
}
