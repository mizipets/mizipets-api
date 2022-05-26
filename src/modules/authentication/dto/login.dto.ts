/**
 * @author Julien DA CORTE
 * @create 2022-03-5
 */
import {
    IsDefined,
    IsEmail,
    IsNotEmpty, IsOptional,
    IsString,
    MinLength
} from 'class-validator';

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

    @IsNotEmpty()
    @IsString()
    deviceType: string

    @IsNotEmpty()
    @IsString()
    os: string

    @IsNotEmpty()
    @IsString()
    os_version: string

    @IsString()
    @IsOptional()
    browser: string

    @IsString()
    @IsOptional()
    browser_version: string
}
