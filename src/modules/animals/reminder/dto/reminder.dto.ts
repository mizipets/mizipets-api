/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import {
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsString
} from 'class-validator';
import { Recurrence } from '../entities/reminder.entity';

export class ReminderDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    animalId: number;

    @IsBoolean()
    @IsNotEmpty()
    isReccurent: boolean;

    @IsString()
    @IsNotEmpty()
    recurrence: Recurrence;

    @IsNotEmpty()
    start: Date;
}
