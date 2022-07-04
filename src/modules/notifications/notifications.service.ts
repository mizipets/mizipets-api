/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-20
 */
import { forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { FindConditions, Repository } from 'typeorm';
import { Roles } from '../authentication/enum/roles.emum';
import { Logger } from '../../shared/logger/logger';
import { UsersService } from '../users/users.service';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationType } from './entities/notification-type.enum';
import { Notification } from './entities/notification.entity';
import { NotificationsGateway } from './notification.gateway';
import { User } from '../users/entities/user.entity';
import { NotificationTypeLabel } from './entities/notification-type-label.enum';

const { FCM_SERVER_KEY, FCM_ENDPOINT_URL } = process.env;

export class NotificationsService {
    private logger: Logger = new Logger(NotificationsService.name);

    private client: AxiosInstance;

    constructor(
        @InjectRepository(Notification)
        private readonly repository: Repository<Notification>,
        private readonly notificationsGateway: NotificationsGateway,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
    ) {
        this.client = axios.create({
            baseURL: FCM_ENDPOINT_URL
        });
    }

    public async sendToUserIds(
        userIds: number[],
        notificationDto: NotificationDTO
    ) {
        const users = await Promise.all(
            userIds.map(async (id) => await this.usersService.getById(id))
        );

        const notification = {
            type: notificationDto.type,
            title: notificationDto.title,
            body: notificationDto.body,
            icon: '@mipmap/ic_launcher'
        } as Notification;

        users.forEach(async (user) => {
            if (!user.preferences.notifications) {
                return;
            }
            this.sendNotificationToUser(user, notification);
        });
    }

    private async sendNotificationToUser(
        user: User,
        notification: Notification
    ) {
        if (user.role === Roles.PRO) {
            await this.notificationsGateway.sendFrontNotification(
                user.id,
                notification
            );
        }
        if (user.flutterToken) {
            await this.sendToDevices(notification, user.flutterToken);
        }

        const userNotification = Object.assign(
            {
                user: {
                    id: user.id
                }
            },
            notification
        );
        await this.repository.save(userNotification);
    }

    private async sendToDevices(notification: Notification, token: string) {
        const serviceText = new Map<NotificationType, string>();
        serviceText.set(NotificationType.MESSAGE, '🐾');
        const fcmNotification = {
            title: `${NotificationTypeLabel[notification.type]} - ${
                notification.title
            }`,
            priority: 'high',
            body: notification.body,
            icon: notification.icon
        };
        try {
            await this.client.post(
                '/fcm/send',
                JSON.stringify({
                    notification: fcmNotification,
                    data: {
                        type: notification.type,
                        click_action: 'FLUTTER_NOTIFICATION_CLICK'
                    },
                    to: token
                }),
                {
                    headers: {
                        Authorization: 'key=' + FCM_SERVER_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (e) {
            this.logger.error(`Failed sending notification to: ${token}`);
        }
    }

    async getBy(
        where: FindConditions<Notification>,
        offset = 0
    ): Promise<Notification[]> {
        return await this.repository.find({
            where: where,
            order: {
                id: 'DESC'
            },
            take: 15,
            skip: offset
        });
    }

    async delete(id: number) {
        return await this.repository.delete(id);
    }
}
