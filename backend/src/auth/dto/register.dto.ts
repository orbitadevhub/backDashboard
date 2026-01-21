import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @Expose()
  @IsNotEmpty()
  @ApiProperty({
    example: 'orbitadevmail@gmail.com', description: 'User email',
  })
  email: string;

  @Expose()
  @IsNotEmpty()
  @ApiProperty({ example: 'orbita', description: 'First Name' })
  firstName: string;

  @Expose()
  @IsNotEmpty()
  @ApiProperty({ example: 'dev', description: 'Last Name' })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message:
      'La contraseña debe incluir al menos una mayúscula y un carácter especial',
  })
  @ApiProperty({ example: '@Orbitadev123', description: 'Password' })
  @IsNotEmpty()
  password: string;

  @IsString()
  @Expose()
  @IsOptional()
  @ApiProperty({ example: 'USER', description: 'Role' })
  roles: string[];
}
