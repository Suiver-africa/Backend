import { IsEmail, IsNotEmpty ,IsString ,IsStrongPassword,isStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}