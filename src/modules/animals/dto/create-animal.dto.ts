import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Race } from '../entity/race.enum';
import { Sexe } from '../entity/sexe.enum';
import { Species } from '../entity/species.entity';

export class CreateAnimalDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly species: Species;

    @IsString()
    @IsOptional()
    readonly sexe: Sexe;

    @IsString()
    @IsOptional()
    readonly race: Race;

    @IsOptional()
    readonly birthDate: Date;

    @IsString()
    @IsOptional()
    readonly comment: string;
}
