import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Race } from '../enum/race.enum';
import { Sex } from '../enum/sex.enum';
import { Species } from '../enum/species.entity';

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
    readonly race: Race;

    @IsString()
    @IsOptional()
    @IsEnum(Sex)
    readonly sex: Sex;

    @IsString()
    @IsOptional()
    readonly birthDate: Date;

    @IsString()
    @IsOptional()
    readonly images: string[];
}
