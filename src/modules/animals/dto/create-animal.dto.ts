/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Sex } from '../enum/sex.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnimalDTO {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly comment: string;

    @ApiProperty()
    @IsOptional()
    readonly birthDate: Date;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly sex: Sex;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    readonly raceId: number;
}
