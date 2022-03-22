import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, I18nJsonParser, HeaderResolver } from 'nestjs-i18n';
import { RootModule } from './modules/root/root.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { DiscordService } from './shared/discord.service';
import { AnimalsModule } from './modules/animals/animals.module';
import { MailModule } from './shared/mail/mail.module';
import { ServicesModule } from './modules/services/services.module';
import { MessagesModule } from './modules/messages/messages.module';
import { RoomModule } from './modules/room/room.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as path from 'path';

@Module({
    imports: [
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 10
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
        RootModule,
        AuthenticationModule,
        UsersModule,
        MailModule,
        AnimalsModule,
        ServicesModule,
        RoomModule,
        MessagesModule
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
