import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class TwoFAGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const payload = req.user;
    if (!payload?.isTwoFactorAuthenticated) {
      throw new UnauthorizedException('2FA not authenticated');
    }
    return true;
  }
}
