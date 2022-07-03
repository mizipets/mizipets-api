/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-20
 */
import { NotificationDTO } from './notification.dto';

export class SendNotificationDTO {
    toUserIds: number[];
    notification: NotificationDTO;
}
