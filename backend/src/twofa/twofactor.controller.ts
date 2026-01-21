import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TwoFactorAuthService } from './twofactor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Enable2FADto } from './dto/twoFactor.dto';
import { Role } from 'src/auth/roles.enum';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RoleGuard } from 'src/auth/guards/roles.guard';

@ApiTags('Two-Factor Authentication')
@Controller('2fa')
export class TwoFactorController {
  constructor(private twoFAService: TwoFactorAuthService) {}

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Get('generate')
  async generate2FA(@Req() req) {
    return this.twoFAService.generateSecret(req.user);
  }

  @ApiBearerAuth('jwt-2fa')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard('jwt-2fa'))
  @Post('enable')
  async enable2FA(@Req() req, @Body() dto: Enable2FADto) {
    return this.twoFAService.enable2FA(req.user, dto.token);
  }
}
