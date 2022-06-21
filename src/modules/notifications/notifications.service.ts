import { forwardRef, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { FindConditions, FindManyOptions, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { NotificationDTO } from './dto/notification.dto';
import { NotificationType } from './entities/notification-type.enum';
import { Notification } from './entities/notification.entity';

const { FCM_SERVER_KEY, FCM_ENDPOINT_URL } = process.env;

export class NotificationsService {
    private logger: Logger = new Logger(NotificationsService.name);

    private client: AxiosInstance;

    constructor(
        @InjectRepository(Notification)
        private readonly repository: Repository<Notification>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
    ) {
        this.client = axios.create({
            baseURL: FCM_ENDPOINT_URL
        });
    }

    public async send(userIds: number[], notificationDto: NotificationDTO) {
        const tokens: string[] = await Promise.all(
            userIds.map(
                async (id) => (await this.usersService.getById(id)).flutterToken
            )
        );
        const notification = {
            type: notificationDto.type,
            title: notificationDto.title,
            body: notificationDto.body,
            icon: '@drawable/app_icon'
        } as Notification;

        tokens
            .filter((token) => token != null)
            .forEach(async (token) => {
                await this.sendToDevices(notification, token);
            });

        userIds.forEach(async (id) => {
            const userNotification = Object.assign(
                {
                    user: {
                        id: id
                    }
                },
                notification
            );
            await this.repository.save(userNotification);
        });
    }

    private async sendToDevices(notification: Notification, token: string) {
        const serviceText = new Map<NotificationType, string>();
        serviceText.set(NotificationType.MESSAGE, '🐾');
        const fcmNotification = {
            title: `🐾 - ${notification.title}`,
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
}
