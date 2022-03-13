import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Sexe } from '../entity/sexe.enum';
import { Species } from '../entity/species.entity';

export class UpdateAnimalDTO {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly comment: string;

    @IsString()
    @IsOptional()
    readonly species: Species;

    @IsString()
    @IsOptional()
    @IsEnum(Sexe)
    readonly sexe: Sexe;

    @IsString()
    @IsOptional()
    readonly birthDate: Date;

    @IsString()
    @IsOptional()
    readonly images: string[];
}
