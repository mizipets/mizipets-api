import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesModule } from '../favorites/favorites.module';
import { RoomModule } from '../room/room.module';
import { UsersModule } from '../users/users.module';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { Animal } from './entities/animal.entity';
import { Race } from './entities/race.entity';
import { Species } from './entities/species.entity';
import { SpeciesController } from './species.controller';
import { SpeciesService } from './species.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Animal, Species, Race]),
        UsersModule,
        FavoritesModule,
        RoomModule
    ],
    controllers: [AnimalsController, SpeciesController],
    providers: [AnimalsService, SpeciesService],
    exports: [AnimalsService, SpeciesService]
})
export class AnimalsModule {}
