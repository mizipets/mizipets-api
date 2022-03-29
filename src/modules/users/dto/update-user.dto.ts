/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    readonly firstname: string;

    @IsString()
    readonly lastname: string;

    @IsEmail()
    readonly email: string;
}
