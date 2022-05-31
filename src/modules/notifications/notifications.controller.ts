/**
 * @author Maxime D'HARBOULLE
 * @create 2022-05-28
 */
import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}
}
