import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TwoFactorAuthService } from './twofactor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('2fa')
export class TwoFactorController {
  constructor(
    private twoFAService: TwoFactorAuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('generate')
  async generate2FA(@Req() req) {
    const user = req.user;
    return this.twoFAService.generateSecret(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('enable')
  async enable2FA(@Req() req, @Body() body) {
    console.log(body.code);
    const user = req.user;
    const { code } = body;

    return this.twoFAService.enable2FA(user, code);
  }
}
