import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @Expose()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/, {
    message: 'La contraseña debe incluir al menos una mayúscula y un carácter especial',
  })
  @ApiProperty()
  password: string;

  @IsString()
  @Expose()
  @IsOptional()
  @ApiProperty()
  roles: string[];
}
