import { IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty()
  twoFactorEnabled?: boolean;

  @ApiProperty()
  googleId?: string;
<<<<<<< HEAD:backend/src/users/dto/update-user.dto.ts

  @IsOptional()
  isTwoFactorEnabled?: boolean;
}
=======
}
>>>>>>> b2390c1fad995188252c9f9cb62c49e447a647f9:backend/src/users/dto/updateProfileDto.ts
