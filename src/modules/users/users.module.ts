import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Favorites } from './Favorites.entity';
import { FavoritesService } from '../favorites/Favorites.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Favorites])],
    controllers: [UsersController],
    providers: [UsersService, FavoritesService],
    exports: [UsersService, FavoritesService]
})
export class UsersModule {}
