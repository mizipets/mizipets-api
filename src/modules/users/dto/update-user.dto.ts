import {IsNotEmpty, IsEmail, IsString, IsEmpty} from 'class-validator'

export class UpdateUserDto {

    @IsString()
    @IsEmpty()
    readonly firstname: string

    @IsString()
    @IsEmpty()
    readonly lastname: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string

    @IsNotEmpty()
    readonly password: string

    @IsNotEmpty()
    readonly id: number
}
