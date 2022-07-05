/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Recurrence } from '../entities/reminder.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReminderDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    animalId: number;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isReccurent: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    recurrence: Recurrence;

    @ApiProperty()
    @IsNotEmpty()
    start: Date;
}
