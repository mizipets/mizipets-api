import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Race } from '../enum/race.enum';
import { Sex } from '../enum/sex.enum';
import { Species } from '../enum/species.entity';

export class CreateAnimalDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly species: Species;

    @IsString()
    @IsOptional()
    readonly sex: Sex;

    @IsString()
    @IsOptional()
    readonly race: Race;

    @IsOptional()
    readonly birthDate: Date;

    @IsString()
    @IsOptional()
    readonly comment: string;
}
