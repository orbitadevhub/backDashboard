import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Enable2FADto {
  @ApiProperty({
    example: '123456',
    description: 'Código TOTP generado por la app autenticadora',
  })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/, {
    message: '2FA token must be a 6-digit numeric code',
  })
  token: string;
}
