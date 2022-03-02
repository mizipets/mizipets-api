import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./modules/users/user.entity";
import {RootModule} from "./modules/root/root.module";
import {AuthenticationModule} from "./modules/authentication/authentication.module";
import {UsersModule} from "./modules/users/users.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['envs/.env', 'envs/.env.staging', 'envs/.env.production'],
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: parseInt(process.env.POSTGRES_PORT),
            username:process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            entities: [
                User
            ],
            synchronize: true,
            ssl: JSON.parse(process.env.POSTGRES_SSL_ACTIVATE),
        }),
        RootModule,
        AuthenticationModule,
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
