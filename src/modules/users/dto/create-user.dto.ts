import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
    // @IsString()
    // @IsNotEmpty()
    // readonly firstname: string
    //
    // @IsString()
    // @IsNotEmpty()
    // readonly lastname: string

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}
