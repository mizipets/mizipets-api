/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesModule } from '../favorites/favorites.module';
import { RoomModule } from '../room/room.module';
import { S3Module } from '../s3/s3.module';
import { UsersModule } from '../users/users.module';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { Animal } from './entities/animal.entity';
import { Reminder } from './entities/reminder.entity';
import { Race } from './entities/race.entity';
import { Specie } from './entities/specie.entity';
import { RacesController } from './race/races.controller';
import { RacesService } from './race/races.service';
import { SpeciesController } from './specie/species.controller';
import { SpeciesService } from './specie/species.service';
import { RemindersController } from './reminder/reminder.controller';
import { RemindersService } from './reminder/reminder.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Animal, Specie, Race, Reminder]),
        forwardRef(() => UsersModule),
        forwardRef(() => FavoritesModule),
        forwardRef(() => S3Module),
        forwardRef(() => RoomModule)
    ],
    controllers: [
        AnimalsController,
        SpeciesController,
        RacesController,
        RemindersController
    ],
    providers: [AnimalsService, SpeciesService, RacesService, RemindersService],
    exports: [AnimalsService, SpeciesService, RacesService, RemindersService]
})
export class AnimalsModule {}
