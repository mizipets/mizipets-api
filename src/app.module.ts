/**
 * @author Maxime D'HARBOULLE & Julien DA CORTE
 * @create 2022-02-14
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, I18nJsonParser, HeaderResolver } from 'nestjs-i18n';
import { RootModule } from './modules/root/root.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { DiscordService } from './shared/discord/discord.service';
import { AnimalsModule } from './modules/animals/animals.module';
import { MailModule } from './shared/mail/mail.module';
import { ServicesModule } from './modules/services/services.module';
import { RoomModule } from './modules/room/room.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path';
import { S3Module } from './modules/s3/s3.module';
import { DeviceModule } from './modules/device/device.module';
import { AdvicesModule } from './modules/advices/advices.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CronModule } from './modules/cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule, RedisService } from '@liaoliaots/nestjs-redis';
import { ThrottlerStorageRedisService } from 'nestjs-throttler-storage-redis';

const { ENV } = process.env;

@Module({
    imports: [
        RedisModule.forRoot(
            {
                readyLog: true,
                errorLog: true,
                config: {
                    host: ENV === 'local' ? 'localhost' : 'redis',
                    port: 6379
                }
            },
            true
        ),
        ThrottlerModule.forRootAsync({
            useFactory(redisService: RedisService) {
                const redis = redisService.getClient();
                return {
                    ttl: 60,
                    limit: 100,
                    storage: new ThrottlerStorageRedisService(redis)
                };
            },
            inject: [RedisService]
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            autoLoadEntities: true,
            synchronize: true,
            ssl: false
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'fr',
            parser: I18nJsonParser,
            parserOptions: {
                path: path.join(__dirname, '/i18n/')
            },
            resolvers: [new HeaderResolver(['x-custom-lang'])]
        }),
        ScheduleModule.forRoot(),
        RootModule,
        AuthenticationModule,
        UsersModule,
        MailModule,
        AnimalsModule,
        ServicesModule,
        S3Module,
        RoomModule,
        DeviceModule,
        AdvicesModule,
        NotificationsModule,
        CronModule
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        DiscordService
    ]
})
export class AppModule {}
