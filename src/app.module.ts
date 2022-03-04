import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, I18nJsonParser, HeaderResolver } from 'nestjs-i18n';
import { User } from './modules/users/user.entity';
import { RootModule } from './modules/root/root.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DiscordService } from './shared/discord.service';
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
            entities: [User],
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
        UsersModule
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
