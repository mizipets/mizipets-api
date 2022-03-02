import {IsDefined, IsEmail, IsNotEmpty, IsString, MinLength,} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsDefined()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @MinLength(8)
  readonly password: string;
}
