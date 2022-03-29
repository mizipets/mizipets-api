/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { IsNotEmpty, IsEmail, IsString, IsObject } from 'class-validator';
import { Address, Preferences, Shelter } from '../user.entity';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    readonly firstname: string;

    @IsString()
    @IsNotEmpty()
    readonly lastname: string;

    @IsObject()
    readonly address: Address;

    @IsObject()
    readonly preferences: Preferences;

    @IsObject()
    readonly shelter: Shelter;
}
