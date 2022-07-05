/**
 * @author Julien DA CORTE
 * @create 2022-03-5
 */
import {
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    @IsDefined()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @MinLength(8)
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    deviceType: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    os: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    os_version: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    browser: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    browser_version: string;
}
