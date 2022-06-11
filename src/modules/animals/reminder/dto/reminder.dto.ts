/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Recurrence } from '../../entities/reminder.entity.';

export class ReminderDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    animalId: number;

    @IsString()
    @IsNotEmpty()
    isReccurent: boolean;

    @IsString()
    @IsNotEmpty()
    reccurence: Recurrence;

    @IsDate()
    @IsNotEmpty()
    start: Date;
}
