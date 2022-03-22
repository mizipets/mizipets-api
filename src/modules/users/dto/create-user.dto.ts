import { IsNotEmpty, IsEmail, IsString, IsObject } from 'class-validator';

export class AddressDto {
    readonly city: string;
    readonly country: string;
    readonly roadName: string;
    readonly roadNumber: string;
}

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
    readonly address: AddressDto;
}
