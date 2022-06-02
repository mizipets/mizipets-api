export class HealthBook {
    vaccins: Vaccin[];
}

export class Vaccin implements Reminder {
    name: string;
    isReccurent: boolean;
    reccurence: Recurrence;
    start: number;

    1000 % 5
    async isReminderToday(): Promise<boolean> {
        // const modulo = (this.start - Date.now()) % this.getReccurenceSeconds();
        // return modulo <;
        return true;
    }

    private getReccurenceSeconds(): number {
        switch (this.reccurence) {
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

export interface Reminder {
    isReccurent: boolean;
    reccurence: Recurrence;
    start: number;
    isReminderToday(): Promise<boolean>;
}

export type Recurrence =
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'bimonthly'
    | 'trimesterly'
    | 'semesterly'
    | 'yearly';
