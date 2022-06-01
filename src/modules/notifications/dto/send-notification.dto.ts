import { NotificationDTO } from './notification.dto';

export class SendNotificationDTO {
    toUserIds: number[];
    notification: NotificationDTO;
}
