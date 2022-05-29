import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { NotificationDTO } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';

const { FCM_SERVER_KEY, FCM_ENDPOINT_URL } = process.env;

export class NotificationsService {
    client: AxiosInstance;

    constructor(
        @InjectRepository(Notification)
        private readonly repository: Repository<Notification>,
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
            icon: 'firebase-logo.png',
            click_action: 'http://localhost:8081'
        } as Notification;

        await this.sendToDevices(notification, tokens);

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

    private async sendToDevices(notification, tokens: string[]) {
        const fcmNotification = {
            title: notification.title,
            body: notification.body,
            icon: notification.icon,
            click_action: notification.click_action
        };

        console.log(tokens);

        this.client
            .post(
                '/fcm/send',
                JSON.stringify({
                    notification: fcmNotification,
                    to: tokens[0]
                }),
                {
                    headers: {
                        Authorization: 'key=' + FCM_SERVER_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            )
            .catch((err) => {
                console.log(err);
                throw new InternalServerErrorException(err.data);
            });
    }
}
