import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Jwt2FAStrategy } from './strategies/jwt2FA.strategy';
import { ContactsModule } from 'src/contacts/contacts.module';
import { TwoFAModule } from 'src/twofa/twofactor.module';

import { QremailModule } from 'src/qremail/qremail.module';

@Module({
  
  imports: [
    ConfigModule,
    UsersModule,
    ContactsModule,
    QremailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_ACCESS_SECRET,
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    TwoFAModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, JwtStrategy, Jwt2FAStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
