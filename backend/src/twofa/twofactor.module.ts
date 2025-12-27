import { Module } from '@nestjs/common';
import { TwoFactorAuthService } from './twofactor.service';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { TwoFactorController } from './twofactor.controller';
import { TwoFAGuard } from './twofactor.guard';
import { QremailModule } from 'src/qremail/qremail.module';
import { CloudinaryService } from 'src/config/cloudinary.service';


@Module({
  imports: [UsersModule, JwtModule.register({}), QremailModule],
  controllers: [TwoFactorController],
  providers: [TwoFactorAuthService, TwoFAGuard, CloudinaryService],
  exports: [TwoFactorAuthService],
})
export class TwoFAModule {}

