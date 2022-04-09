/**
 * @author Julien DA CORTE
 * @create 2022-03-5
 */
import {
    IsDefined,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString
} from 'class-validator';
import { Roles } from '../enum/roles.emum';

export class JwtPayloadDto {
    @IsNumber()
    @IsNotEmpty()
    @IsDefined()
    id: number;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @IsDefined()
    lastname: string;

    @IsNotEmpty()
    @IsDefined()
    role: Roles;
}
