import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class Verify2FADto {
  @IsString()
  @ApiProperty()
  token: string;
}
