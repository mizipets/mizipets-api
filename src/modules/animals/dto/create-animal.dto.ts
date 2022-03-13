import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Sexe } from '../entity/sexe.enum';
import { Species } from '../entity/species.entity';

export class CreateAnimalDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly speciesId: number;

    @IsString()
    @IsOptional()
    readonly sexe: Sexe;

    @IsOptional()
    readonly birthDate: Date;

    @IsString()
    @IsOptional()
    readonly comment: string;
}
