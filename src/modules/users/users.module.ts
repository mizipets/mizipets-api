import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Favorites } from '../favorites/favorites.entity';
import { FavoritesService } from '../favorites/favorites.service';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), FavoritesModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
