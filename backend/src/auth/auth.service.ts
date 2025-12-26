import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(
    email: string,
    password: string,
    lastName: string,
    firstName: string,
    roles: string[] = ['USER']
  ) {
    const existUser = await this.usersService.findOneByEmail(email);

    if (existUser) {
      throw new NotFoundException(`User with email ${email} already exist`);
    }

    const createdUser = await this.usersService.create({
      email: removeAccents(email.toLowerCase()),
      password,
      lastName,
      firstName,
      roles,
    });

    return createdUser;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(
      removeAccents(email.toLowerCase())
    );

    if (user?.googleId) {
      throw new UnauthorizedException(
        'This user logged in with Google. Use Google login.'
      );
    }

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tempToken = this.jwtService.sign(
      {
        sub: user.id,
        mfa: 'PENDING',
      },
      { expiresIn: '5m' }
    );

    return {
      mfaRequired: true,
      tempToken,
    };
  }

  async login2FA(email: string, code: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (!user || !user.twoFactorEnabled) {
      throw new UnauthorizedException('2FA is not enabled for this user');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    return {
      accessTocken: this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        roles: user.roles || ['USER'],
      }),
    };
  }

  async generate2FASecret(userId: string) {
    const user = await this.usersService.findOne(userId);

    const secret = speakeasy.generateSecret({
      name: `MiApp (${user.email})`,
      length: 20,
    });

    user.twoFactorSecret = secret.base32;
    await this.usersService.update(user.id, user);

    if (!secret.otpauth_url) {
      throw new NotFoundException('Failed to generate otpauth URL for 2FA');
    }

    const qr = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
      qrCode: qr,
    };
  }

  async enable2FA(userId: string, code: string) {
    const user = await this.usersService.findOne(userId);

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }

    user.twoFactorEnabled = true;
    await this.usersService.update(user.id, user);

    return { message: '2FA has been enabled successfully' };
  }

  async findOrCreateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  }) {
    let user = await this.usersService.findOrCreateGoogleUser({
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.firstName,
      roles: ['USER'],
    });

    if (user) return user;

    const foundUser = await this.usersService.findOneByEmail(googleUser.email);

    if (foundUser) {
      foundUser.googleId = googleUser.googleId;
      await this.usersService.update(foundUser.id, {
        googleId: foundUser.googleId,
      });
      return foundUser;
    }

    return this.usersService.create({
      googleId: googleUser.googleId,
      email: googleUser.email,
      lastName: googleUser.lastName,
      firstName: googleUser.firstName,
      isVerified: true,
      roles: ['USER'],
    });
  }
}
