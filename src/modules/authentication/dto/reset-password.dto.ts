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
    MinLength
} from 'class-validator';

export class ResetPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @IsDefined()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @MinLength(8)
    readonly password: string;

    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    readonly code: number;
}
