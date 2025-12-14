import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TwoFactorAuthService } from './twofactor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../auth/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { QremailService } from '../qremail/qremail.service';

@Controller('2fa')
export class TwoFactorController {
  constructor(
    private twoFAService: TwoFactorAuthService,
    private QremailService: QremailService
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Post('/setup')
  async setup2FA(@Req() req) {
    const { qrCodeBase64 } = await this.twoFAService.generateSecret(req.user);

    await this.QremailService.send2FAQRCode(req.user.email, qrCodeBase64);

    return {
      message: 'QR enviado por correo electrónico',
    };
  }
}
