/**
 * @author Maxime D'HARBOULLE
 * @create 2022-05-28
 */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendNotificationDTO } from './dto/send-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post()
    @HttpCode(HttpStatus.OK)
    async sendNotification(@Body() send: SendNotificationDTO) {
        return await this.notificationsService.send(
            send.toUserIds,
            send.notification
        );
    }
}
