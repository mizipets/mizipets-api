/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-09
 */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Animal } from './animal.entity';

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

    async isReminderToday(): Promise<boolean> {
        // const modulo = (this.start - Date.now()) % this.getReccurenceSeconds();
        // return modulo <;
        return false;
    }

    private getReccurenceSeconds(): number {
        switch (this.recurrence) {
            case 'daily':
                return 60 * 60 * 24;
            case 'weekly':
                return 60 * 60 * 24 * 7;
            case 'monthly':
                return 60 * 60 * 24 * 31;
            case 'bimonthly':
                return 60 * 60 * 24 * 31 * 2;
            case 'trimesterly':
                return 60 * 60 * 24 * 31 * 4;
            case 'semesterly':
                return 60 * 60 * 24 * 31 * 6;
            case 'yearly':
                return 60 * 60 * 24 * 31 * 12;
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
