import { NotificationType } from '../entities/notification-type.enum';

export class NotificationDTO {
    type: NotificationType;
    title: string;
    body: string;
    icon?: string;
}
