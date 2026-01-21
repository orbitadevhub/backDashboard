import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { RegisterDto } from './dto/register.dto';
import { TwoFactorAuthService } from 'src/twofa/twofactor.service';
import { QremailService } from 'src/qremail/qremail.service';
import { Verify2FADto } from './dto/verify2FA.dto';

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private qremailService: QremailService,
    private jwtService: JwtService,
    private twoFactorAuthService: TwoFactorAuthService
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, firstName, lastName } = dto;

    const exists = await this.usersService.findOneByEmail(email);
    if (exists) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email: removeAccents(email.toLowerCase()),
      password: hashedPassword,
      firstName,
      lastName,
      roles: ['USER'],
      twoFactorEnabled: false,
    });

    const { secret, qrCodeBase64 } =
      await this.twoFactorAuthService.generateSecret(user);

    await this.usersService.setTwoFactorSecret(user.id, secret);

    await this.qremailService.send2FAQRCode(user.email, qrCodeBase64);

    return {
      message: 'Usuario registrado. Revise su correo para activar 2FA.',
    };
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

  async enable2FA(dto:Verify2FADto ,userId: string, code: string) {
    const { token } = dto; 
    const user = await this.usersService.findByIdWithTwoFactorSecret(userId);

    if (!user || !user.twoFactorSecret) {
      throw new UnauthorizedException(
        '2FA no está configurado para este usuario'
      );
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret, 
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid 2FA code');
    }
    if (!isValid) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    await this.usersService.enableTwoFactor(userId);

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
