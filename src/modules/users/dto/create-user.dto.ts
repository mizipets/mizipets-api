/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { IsNotEmpty, IsEmail, IsString, IsObject } from 'class-validator';
import { Address, Preferences, Shelter } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly firstname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly lastname: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    photo: string;

    @ApiProperty()
    @IsObject()
    readonly address: Address;

    @ApiProperty()
    @IsObject()
    readonly preferences: Preferences;

    @ApiProperty()
    readonly shelter: Shelter | null;
}
