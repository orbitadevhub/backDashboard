import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.Dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TwoFactorAuthService } from '../twofa/twofactor.service';
import { QremailService } from 'src/qremail/qremail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private readonly twoFAService: TwoFactorAuthService,
    private readonly qremailService: QremailService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Registro de usuario' })
  @ApiBody({ type: RegisterDto, description: 'Datos de registro' })
  @ApiResponse({ status: 200, description: 'Registro exitoso' })
  async register(@Body() registerDto: RegisterDto) {

    try {
       await this.authService.register(
        registerDto.email,  
        registerDto.password,
        registerDto.lastName,
        registerDto.firstName,
        registerDto.roles
      );
      const qrCode = await this.twoFAService.generateSecret(registerDto.email);
  
      const send2FAQRCode = this.qremailService.send2FAQRCode(
        registerDto.email,
        qrCode.qrCodeBase64
      );

     return { message: `User with email ${registerDto.email} created successfully` };
    } catch (error) {
      throw new Error( error.message);
    }


  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiBody({ type: LoginDto, description: 'Credenciales de acceso' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(
    @Req() req,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const user = await this.authService.findOrCreateGoogleUser(req.user);

      const token = await this.jwtService.signAsync({
        id: user.googleId,
        email: user.email,
        name: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      });
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV') === 'production',
          sameSite: 'strict',
          maxAge: 3600000,
          domain: this.configService.get('COOKIE_DOMAIN') || 'localhost',
        })
        .redirect(
          this.configService.get<string>('FRONTEND_SUCCESS_URL') ?? '/'
        );
    } catch (error) {
      console.error('Google Auth Error:', error);
      res.redirect(
        `${this.configService.get('FRONTEND_ERROR_URL')}?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return {
      user: req.user,
      message: 'Información del perfil protegida',
    };
  }

  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token').json({ message: 'Sesión cerrada' });
  }

  
  @Post('2fa/verify')
  verify2FA(@Body() { userId, code }: { userId: string; code: string }) {
    return this.twoFAService.verifyCode(userId, code);
  }
}
