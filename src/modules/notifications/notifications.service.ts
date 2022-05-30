import { InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosInstance } from 'axios';
import { Repository } from 'typeorm';
import { ServiceType } from '../services/enums/service-type.enum';
import { UsersService } from '../users/users.service';
import { NotificationDTO } from './dto/notification.dto';
import { Notification } from './entities/notification.entity';

const { FCM_SERVER_KEY, FCM_ENDPOINT_URL } = process.env;

export class NotificationsService {
    private client: AxiosInstance;

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

    async sendToDevices(notificationa, tokens: string[]) {
        const key =
            'AAAAvSTwzv8:APA91bH_g5y868eEIVG5mvH9NxhRhtR9skdrH3w2fb18OGEoAPD71iSLc2aCZr_dX9hupYBmnfl6x-jm4TfVgPzvKmmAsY5oQGQPPUgJIyn_kMGh_YLkm6M9zIlTzDvX8JYfxFNGyDhj';
        const to =
            'fX_JmzSaQyq8auPWEPYAdK:APA91bGcYJq6WA4Y0H1lbHHkzk_0ThUIjHwGA1NHoyxfIepmoKERIR5XETbE4VBgdzDiZkfXLAkeDKJFdIkI2PXbZ39PHEavPXzJs-d8Sj2llX6GbYZJJmq45129lR-BvkOcIpmCezUW';
        const notification = {
            title: 'Portugal vs. Denmark',
            body: '5 to 1',
            priority: 'high',
            // condition: " 'Symulti' in topics || 'SymultiLite' in topics",
            // icon: 'http://49.12.198.51:9000/mizipets/avatar_default.jpg',
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            data: {
                type: ServiceType.ADOPTION,
                id: 2
            }
        };

        const result = await this.client.post(
            '/fcm/send',
            JSON.stringify({
                notification: notification,
                data: {
                    click_action: 'FLUTTER_NOTIFICATION_CLICK'
                },
                to: to
            }),
            {
                headers: {
                    Authorization: 'key=' + key,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log(result.status);
        // const fcmNotification = {
        //     title: notification.title,
        //     body: notification.body,
        //     icon: notification.icon,
        //     click_action: notification.click_action
        // };

        // console.log(tokens);
        // console.log(FCM_SERVER_KEY);
        // console.log(FCM_ENDPOINT_URL);

        // this.client
        //     .post(
        //         '/fcm/send',
        //         JSON.stringify({
        //             notification: fcmNotification,
        //             to: 'fX_JmzSaQyq8auPWEPYAdK:APA91bGcYJq6WA4Y0H1lbHHkzk_0ThUIjHwGA1NHoyxfIepmoKERIR5XETbE4VBgdzDiZkfXLAkeDKJFdIkI2PXbZ39PHEavPXzJs-d8Sj2llX6GbYZJJmq45129lR-BvkOcIpmCezUW'
        //         }),
        //         {
        //             headers: {
        //                 Authorization: 'key=' + FCM_SERVER_KEY,
        //                 'Content-Type': 'application/json'
        //             }
        //         }
        //     )
        //     .catch((err) => {
        //         throw new InternalServerErrorException(err.data);
        //     });
    }
}

// import { InternalServerErrorException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import axios, { AxiosInstance } from 'axios';
// import { Repository } from 'typeorm';
// import { ServiceType } from '../services/enums/service-type.enum';
// import { UsersService } from '../users/users.service';
// import { NotificationDTO } from './dto/notification.dto';
// import { Notification } from './entities/notification.entity';

// const { FCM_SERVER_KEY, FCM_ENDPOINT_URL } = process.env;

// export class NotificationsService {
//     private client: AxiosInstance;

//     constructor(
//         @InjectRepository(Notification)
//         private readonly repository: Repository<Notification>,
//         private usersService: UsersService
//     ) {
//         this.client = axios.create({
//             baseURL: FCM_ENDPOINT_URL
//         });
//     }

//     public async send(userIds: number[], notificationDto: NotificationDTO) {
//         const tokens: string[] = await Promise.all(
//             userIds.map(
//                 async (id) => (await this.usersService.getById(id)).flutterToken
//             )
//         );
//         const notification = {
//             type: notificationDto.type,
//             title: notificationDto.title,
//             body: notificationDto.body,
//             icon: 'firebase-logo.png',
//             click_action: 'http://localhost:8081'
//         } as Notification;

//         await this.sendToDevices(notification, tokens);

//         userIds.forEach(async (id) => {
//             const userNotification = Object.assign(
//                 {
//                     user: {
//                         id: id
//                     }
//                 },
//                 notification
//             );
//             await this.repository.save(userNotification);
//         });
//     }

//     async sendToDevices(notificationa, tokens: string[]) {
//         const key =
//             'AAAAvSTwzv8:APA91bH_g5y868eEIVG5mvH9NxhRhtR9skdrH3w2fb18OGEoAPD71iSLc2aCZr_dX9hupYBmnfl6x-jm4TfVgPzvKmmAsY5oQGQPPUgJIyn_kMGh_YLkm6M9zIlTzDvX8JYfxFNGyDhj';
//         const to =
//             'fX_JmzSaQyq8auPWEPYAdK:APA91bGcYJq6WA4Y0H1lbHHkzk_0ThUIjHwGA1NHoyxfIepmoKERIR5XETbE4VBgdzDiZkfXLAkeDKJFdIkI2PXbZ39PHEavPXzJs-d8Sj2llX6GbYZJJmq45129lR-BvkOcIpmCezUW';
//         const notification = {
//             title: 'Portugal vs. Denmark',
//             body: '5 to 1',
//             priority: 'high',
//             // condition: " 'Symulti' in topics || 'SymultiLite' in topics",
//             // icon: 'http://49.12.198.51:9000/mizipets/avatar_default.jpg',
//             click_action: 'FLUTTER_NOTIFICATION_CLICK',
//             data: {
//                 type: ServiceType.ADOPTION,
//                 id: 2
//             }
//         };

//         const result = await this.client.post(
//             '/fcm/send',
//             JSON.stringify({
//                 notification: notification,
//                 data: {
//                     click_action: 'FLUTTER_NOTIFICATION_CLICK'
//                 },
//                 to: to
//             }),
//             {
//                 headers: {
//                     Authorization: 'key=' + key,
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
//         console.log(result.status);
//         // const fcmNotification = {
//         //     title: notification.title,
//         //     body: notification.body,
//         //     icon: notification.icon,
//         //     click_action: notification.click_action
//         // };

//         // console.log(tokens);
//         // console.log(FCM_SERVER_KEY);
//         // console.log(FCM_ENDPOINT_URL);

//         // this.client
//         //     .post(
//         //         '/fcm/send',
//         //         JSON.stringify({
//         //             notification: fcmNotification,
//         //             to: 'fX_JmzSaQyq8auPWEPYAdK:APA91bGcYJq6WA4Y0H1lbHHkzk_0ThUIjHwGA1NHoyxfIepmoKERIR5XETbE4VBgdzDiZkfXLAkeDKJFdIkI2PXbZ39PHEavPXzJs-d8Sj2llX6GbYZJJmq45129lR-BvkOcIpmCezUW'
//         //         }),
//         //         {
//         //             headers: {
//         //                 Authorization: 'key=' + FCM_SERVER_KEY,
//         //                 'Content-Type': 'application/json'
//         //             }
//         //         }
//         //     )
//         //     .catch((err) => {
//         //         throw new InternalServerErrorException(err.data);
//         //     });
//     }
// }
