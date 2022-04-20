/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { IsNotEmpty, IsEmail, IsString, IsObject } from 'class-validator';
import { Address, Preferences, Shelter } from '../entities/user.entity';
import { IsNull } from 'typeorm';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

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

    readonly shelter: Shelter | null;
}
