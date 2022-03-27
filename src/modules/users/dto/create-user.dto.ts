import { IsNotEmpty, IsEmail, IsString, IsObject } from 'class-validator';
import { Address, Preferences } from '../user.entity';


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
}
