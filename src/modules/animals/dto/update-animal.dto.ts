import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Sex } from '../enum/sex.enum';
import { Species } from '../entities/species.entity';

export class UpdateAnimalDTO {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly comment: string;

    @IsNumber()
    @IsOptional()
    readonly raceId: number;

    @IsString()
    @IsOptional()
    @IsEnum(Sex)
    readonly sex: Sex;

    @IsString()
    @IsOptional()
    readonly birthDate: Date;

    @IsOptional()
    readonly images: string[];
}
