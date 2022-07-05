/**
 * @author Julien DA CORTE
 * @create 2022-06-26
 */
import {
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
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
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    readonly code: number;
}
