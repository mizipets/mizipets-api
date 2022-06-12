/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Animal } from '../../entities/animal.entity';
import * as moment from 'moment';

@Entity('reminders')
export class Reminder {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column()
    isReccurent: boolean;

    @Column('text')
    recurrence: Recurrence;

    @Column()
    start: Date;

    @Column({ default: true })
    isOn: boolean;

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

    private getReccurenceDays(): number {
        switch (this.recurrence) {
            case 'daily':
                return 1;
            case 'weekly':
                return 7;
            case 'monthly':
                return 31;
            case 'bimonthly':
                return 31 * 2;
            case 'trimesterly':
                return 31 * 4;
            case 'semesterly':
                return 31 * 6;
            case 'yearly':
                return 31 * 12;
        }
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
