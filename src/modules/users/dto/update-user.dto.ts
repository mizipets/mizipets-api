/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { IsEmail, IsObject, IsString } from 'class-validator';
import { Address, Preferences, Shelter } from '../user.entity';

export class UpdateUserDto {
    @IsString()
    readonly firstname: string;

    @IsString()
    readonly lastname: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly photoUrl: string;

    @IsObject()
    readonly address: Address;

    @IsObject()
    readonly preferences: Preferences;

    @IsObject()
    readonly shelter: Shelter;
}
