/**
 * @author Julien DA CORTE
 * @create 2022-03-11
 */
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FavoritesModule } from '../favorites/favorites.module';
import { MailModule } from '../../shared/mail/mail.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), FavoritesModule, MailModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
