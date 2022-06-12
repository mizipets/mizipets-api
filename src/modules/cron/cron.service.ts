import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RemindersService } from '../animals/reminder/reminder.service';
import { NotificationDTO } from '../notifications/dto/notification.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { ServiceType } from '../services/enums/service-type.enum';

const { CRON_SCHEDULE } = process.env;

@Injectable()
export class CronService {
    private logger: Logger = new Logger(CronService.name);

    constructor(
        private remindersService: RemindersService,
        private notificationsService: NotificationsService
    ) {}

    @Cron(CRON_SCHEDULE ?? '0 08 * * *')
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

                const notification: NotificationDTO = {
                    type: ServiceType.PETS,
                    title: `Reminder for `,
                    body: `[${reminder.name}] This is your ${reminder.recurrence} reminder for ${reminder.animal.name}`
                };
                await this.notificationsService.send(
                    [reminder.animal.owner.id],
                    notification
                );
            }
        }

        this.logger.log('End reminder check');
    }
}
