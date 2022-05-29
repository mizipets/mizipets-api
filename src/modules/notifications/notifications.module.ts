import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Notification } from './entities/notification.entity';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notification]), UsersModule],
    providers: [NotificationsService],
    exports: [NotificationsService],
    controllers: [NotificationsController]
})
export class NotificationsModule {}
