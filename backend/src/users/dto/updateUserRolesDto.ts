import { IsArray, IsEnum } from 'class-validator';
import { Role } from 'src/auth/roles.enum';


export class UpdateUserRolesDto {
  @IsArray()
  @IsEnum(Role, { each: true })
  roles: Role[];
}
