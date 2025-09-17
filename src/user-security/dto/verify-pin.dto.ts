import { IsString, Length, IsNotEmpty } from 'class-validator';

export class VerifyPinDto {
  @IsNotEmpty()
  userId: string;

  @IsString()
  @Length(4,4)
  pin: string;
}