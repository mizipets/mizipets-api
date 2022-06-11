/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { IsNotEmpty, IsString } from 'class-validator';
import { Recurrence } from '../../entities/reminder.entity';

export class EditReminderDto {
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
    recurrence: Recurrence;
}
