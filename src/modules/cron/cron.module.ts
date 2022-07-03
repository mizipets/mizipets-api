/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-20
 */
import { Module } from '@nestjs/common';
import { AnimalsModule } from '../animals/animals.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { CronService } from './cron.service';

@Module({
    imports: [AnimalsModule, NotificationsModule],
    providers: [CronService]
})
export class CronModule {}
