/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-17
 */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UsersModule } from '../users/users.module';
import { AnimalsModule } from '../animals/animals.module';
import { RoomGateway } from './room.gateway';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Room]),
        UsersModule,
        AnimalsModule,
        FavoritesModule
    ],
    providers: [RoomService, RoomGateway],
    exports: [RoomService],
    controllers: [RoomController]
})
export class RoomModule {}
