/**
 * @author  Maxime D'HARBOULLE
 * @create 2022-04-26
 */
import { ServiceType } from '../../services/enums/service-type.enum';

export class Notification {
    type: ServiceType;
    text: string;
    actionId: number;
    created: Date;
}
