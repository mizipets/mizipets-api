import { ServiceType } from '../../services/enums/service-type.enum';

export class NotificationDTO {
    type: ServiceType;
    title: string;
    body: string;
    icon: string;
}
