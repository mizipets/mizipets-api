import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Sex } from '../enum/sex.enum';

export class CreateAnimalDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly speciesId: number;

    @IsString()
    @IsOptional()
    readonly sex: Sex;

    @IsOptional()
    readonly birthDate: Date;

    @IsString()
    @IsOptional()
    readonly comment: string;
}
