/**
 * @author Julien DA CORTE
 * @create 2022-03-11
 */
import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FavoritesModule } from '../favorites/favorites.module';
import { MailModule } from '../../shared/mail/mail.module';
import { AnimalsModule } from '../animals/animals.module';
import { S3Module } from '../s3/s3.module';
import { DeviceModule } from '../device/device.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        FavoritesModule,
        MailModule,
        DeviceModule,
        NotificationsModule,
        forwardRef(() => AnimalsModule),
        forwardRef(() => S3Module)
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
