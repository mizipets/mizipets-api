import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RemindersService } from '../animals/reminder/reminder.service';

const { CRON_SCHEDULE } = process.env;

@Injectable()
export class CronService {
    private logger: Logger = new Logger(CronService.name);

    constructor(private remindersService: RemindersService) {}

    @Cron('*/2 * * * * *')
    async checkMedicalReminders() {
        this.logger.log('Start reminder check');

        const reminders = await this.remindersService.getAllWhere({
            isOn: true,
            animal: {
                deletedDate: null
            }
        });

        for (const reminder of reminders) {
            if (reminder.isReminderAtDate()) {
                console.log(`Send notif to owner of ${reminder.animal.name}`);
            }
        }

        this.logger.log('End reminder check');
    }
}
