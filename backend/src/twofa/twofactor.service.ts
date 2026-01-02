import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async generateSecret(user: { id: string; email: string }) {
    const secret = speakeasy.generateSecret({
      name: `Orbitadev (${user.email})`,
    });

    if (!secret.otpauth_url) {
      throw new Error('Failed to generate OTP auth URL');
    }

    const qrCodeBase64 = await qrcode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCodeBase64,
    };
  }

  async enable2FA(user: any, code: string) {
    const freshUser = await this.usersService.getTwoFactorSecret(user.id);

    const isValid = speakeasy.totp.verify({
      secret: freshUser,
      encoding: 'base32',
      token: code,
    });

    if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

    await this.usersService.update(user.id, {
      twoFactorEnabled: true,
    });

    return { message: '2FA Enabled' };
  }

  async verifyCode(token: string, userId: string): Promise<boolean> {
    const user = await this.usersService.findByIdWithTwoFactorSecret(userId);

    if (!user || !user.twoFactorSecret) {
      return false;
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!isValid) {
      return false;
    }

    if (!user.twoFactorEnabled) {
      await this.usersService.update(user.id, {
        twoFactorEnabled: true,
      });
    }

    return true;
  }
}
