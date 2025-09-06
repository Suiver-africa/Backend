import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber(undefined)
  phone?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
  tag: string;
}
