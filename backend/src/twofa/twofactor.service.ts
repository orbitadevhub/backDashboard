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

  async generateSecret(user: any) {
    const secret = speakeasy.generateSecret({
      name: `Orbitadev (${user.email})`,
    });

    await this.usersService.update(user.id, {
      twoFactorSecret: secret.base32,
      twoFactorEnabled: false,
    } as any);

    if (!secret.otpauth_url) {
      throw new Error('Failed to generate OTP auth URL');
    }

    const qrCodeBase64 = await qrcode.toDataURL(secret.otpauth_url);

    return {
      qrCodeBase64,
    };
  }

  async enable2FA(user: any, code: string) {
    const freshUser = await this.usersService.findOne(user.id);

    const isValid = speakeasy.totp.verify({
      secret: freshUser.twoFactorSecret,
      encoding: 'base32',
      token: code,
    });

    if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

    await this.usersService.update(user.id, {
      isTwoFactorEnabled: true,
    });

    return { message: '2FA Enabled' };
  }

  async verifyCode(userId: string, code: string) {
    const user = await this.usersService.findOne(userId);

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
    });

    if (!isValid) throw new UnauthorizedException('Invalid 2FA code');

    const token = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        roles: user.roles,
        isTwoFactorAuthenticated: true,
      },
      {
        secret: process.env.JWT_SECRET,
      }
    );
    return { accessToken: token };
  }
}
