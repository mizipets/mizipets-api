import { getToken } from '@firebase/messaging';
import * as admin from 'firebase-admin';

export class NotificationsService {
    firebaseConfig = {
        project_info: {
            project_number: '812368580351',
            project_id: 'mizipets-a3a31',
            storage_bucket: 'mizipets-a3a31.appspot.com'
        },
        client: [
            {
                client_info: {
                    mobilesdk_app_id:
                        '1:812368580351:android:56b3b6f70a91a7203586ca',
                    android_client_info: {
                        package_name: 'com.mizipets'
                    }
                },
                oauth_client: [
                    {
                        client_id:
                            '812368580351-9vdb6lob01jh8mcmltrdpor7n2c7tl06.apps.googleusercontent.com',
                        client_type: 3
                    }
                ],
                api_key: [
                    {
                        current_key: 'AIzaSyDGa86HZYw8FLeVc9Kj-H3lzxrdD4af2x8'
                    }
                ],
                services: {
                    appinvite_service: {
                        other_platform_oauth_client: [
                            {
                                client_id:
                                    '812368580351-9vdb6lob01jh8mcmltrdpor7n2c7tl06.apps.googleusercontent.com',
                                client_type: 3
                            }
                        ]
                    }
                }
            },
            {
                client_info: {
                    mobilesdk_app_id:
                        '1:812368580351:android:1f0dccf2d47b34b43586ca',
                    android_client_info: {
                        package_name: 'com.mizipets'
                    }
                },
                oauth_client: [
                    {
                        client_id:
                            '812368580351-9vdb6lob01jh8mcmltrdpor7n2c7tl06.apps.googleusercontent.com',
                        client_type: 3
                    }
                ],
                api_key: [
                    {
                        current_key: 'AIzaSyDGa86HZYw8FLeVc9Kj-H3lzxrdD4af2x8'
                    }
                ],
                services: {
                    appinvite_service: {
                        other_platform_oauth_client: [
                            {
                                client_id:
                                    '812368580351-9vdb6lob01jh8mcmltrdpor7n2c7tl06.apps.googleusercontent.com',
                                client_type: 3
                            }
                        ]
                    }
                }
            }
        ],
        configuration_version: '1'
    };

    // serverKey =
    //     'AAAA0ftVDCg:APA91bEABWApmKUjcC6xlXBFfjGbfe-CLN2SnoryFudC1BmJM3JXwsIC32hH8KiprjEubj82RZyXbX-6rbO5XeJFDPoREcEbhkOQ1fpqeozdR2u-OWn8k-YtZuRLn9x6GqkcUcVDwrcY';
    // app = initializeApp(this.firebaseConfig);

    // constructor() {}

    // async sendNotification(title: string, body: string, type: ServiceType) {
    //     await messaging.sendMulticast({
    //         tokens: ['token_1', 'token_2'],
    //         notification: {
    //             title: 'New message from: Maxime!',
    //             body: 'A new weather warning has been issued for your location.',
    //             imageUrl: 'https://my-cdn.com/extreme-weather.png'
    //         }
    //     });
    // }

    async send(userId: number) {
        console.log('init app');
        await admin.messaging().sendToDevice(
            'fX_JmzSaQyq8auPWEPYAdK:APA91bGcYJq6WA4Y0H1lbHHkzk_0ThUIjHwGA1NHoyxfIepmoKERIR5XETbE4VBgdzDiZkfXLAkeDKJFdIkI2PXbZ39PHEavPXzJs-d8Sj2llX6GbYZJJmq45129lR-BvkOcIpmCezUW', // ['token_1', 'token_2', ...]
            {
                data: {
                    msg: 'msg'
                }
            },
            {
                contentAvailable: true,
                priority: 'high'
            }
        );
    }
}
