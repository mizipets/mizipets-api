/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import {
    IsArray,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString
} from 'class-validator';
import { Sex } from '../enum/sex.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnimalDTO {
    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly comment: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    readonly raceId: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsEnum(Sex)
    readonly sex: Sex;

    @ApiProperty()
    @IsString()
    @IsOptional()
    readonly birthDate: Date;

    @ApiProperty({ type: [String] })
    @IsArray()
    @IsOptional()
    readonly images: string[];
}
