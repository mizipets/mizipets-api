/**
 * @author Julien DA CORTE
 * @create 2022-04-18
 */
import {IsNotEmpty, IsString, IsBoolean} from 'class-validator';
import {ServiceType} from "../enums/service-type.enum";


export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    readonly description: string | null;

    @IsString()
    @IsNotEmpty()
    readonly imagePath: string;

    @IsNotEmpty()
    readonly serviceType: ServiceType;

    @IsBoolean()
    readonly isActive: boolean;
}
