import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Sex } from '../enum/sex.enum';

export class CreateAnimalDTO {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly comment: string;

    @IsOptional()
    readonly birthDate: Date;

    @IsString()
    @IsOptional()
    readonly sex: Sex;

    @IsNumber()
    @IsNotEmpty()
    readonly raceId: number;
}
