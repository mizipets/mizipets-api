/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-17
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UsersModule } from '../users/users.module';
import { AnimalsModule } from '../animals/animals.module';

@Module({
    imports: [TypeOrmModule.forFeature([Room]), UsersModule, AnimalsModule],
    providers: [RoomService],
    exports: [RoomService],
    controllers: [RoomController]
})
export class RoomModule {}
