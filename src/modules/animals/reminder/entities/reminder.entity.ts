/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Animal } from '../../entities/animal.entity';
import moment from 'moment';
import { ApiProperty } from '@nestjs/swagger';

@Entity('reminders')
export class Reminder {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    name: string;

    @ApiProperty()
    @Column()
    isReccurent: boolean;

    @ApiProperty()
    @Column('text')
    recurrence: Recurrence;

    @ApiProperty()
    @Column()
    start: Date;

    @ApiProperty()
    @Column({ default: true })
    isOn: boolean;

    @ApiProperty({ type: () => Animal })
    @ManyToOne(() => Animal, (animal) => animal.reminders)
    animal: Animal;

    isReminderAtDate(date: Date = new Date()): boolean {
        const startOf = this.getReccurenceStartOf();

        const currentDay = moment(date).startOf('day');

        const reminderDay = moment(date).startOf(startOf);

        if (
            this.recurrence === 'bimonthly' &&
            (currentDay.month() + 1) % 2 !== 0
        ) {
            return false;
        }
        if (
            this.recurrence === 'trimesterly' &&
            (currentDay.month() + 1) % 4 !== 0
        ) {
            return false;
        }
        if (
            this.recurrence === 'semesterly' &&
            (currentDay.month() + 1) % 6 !== 0
        ) {
            return false;
        }
        return moment(currentDay.toDate()).isSame(moment(reminderDay.toDate()));
    }

    private getReccurenceStartOf(): moment.unitOfTime.StartOf {
        switch (this.recurrence) {
            case 'daily':
                return 'day';
            case 'weekly':
                return 'isoWeek';
            case 'monthly':
                return 'month';
            case 'bimonthly':
                return 'month';
            case 'trimesterly':
                return 'month';
            case 'semesterly':
                return 'month';
            case 'yearly':
                return 'year';
        }
    }
}

export type Recurrence =
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'bimonthly'
    | 'trimesterly'
    | 'semesterly'
    | 'yearly';
