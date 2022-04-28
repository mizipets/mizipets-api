import * as messaging from '@firebase/messaging';
import { ServiceType } from '../modules/services/enums/service-type.enum';
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

export class NotificationsService {
    firebaseConfig = {
        project_info: {
            project_number: '901864819752',
            project_id: 'mizipets-9f82f',
            storage_bucket: 'mizipets-9f82f.appspot.com'
        },
        client: [
            {
                client_info: {
                    mobilesdk_app_id:
                        '1:901864819752:android:3b9d56c2a8146b5be9b91d',
                    android_client_info: {
                        package_name: 'com.mizipets'
                    }
                },
                oauth_client: [
                    {
                        client_id:
                            '901864819752-8jvpsudm1j83mkam6h3uovu5g4nmefns.apps.googleusercontent.com',
                        client_type: 3
                    }
                ],
                api_key: [
                    {
                        current_key: 'AIzaSyClRhdYetgz-Ozl28toVyqoQNs4CHSPsGA'
                    }
                ],
                services: {
                    appinvite_service: {
                        other_platform_oauth_client: [
                            {
                                client_id:
                                    '901864819752-8jvpsudm1j83mkam6h3uovu5g4nmefns.apps.googleusercontent.com',
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
}
