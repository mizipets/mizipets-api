import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { Animal } from './entity/animal.entity';
import { Race } from './entity/race.entity';
import { Species } from './entity/species.entity';
import { SpeciesController } from './species.controller';
import { SpeciesService } from './species.service';

@Module({
    imports: [TypeOrmModule.forFeature([Animal, Species, Race]), UsersModule],
    controllers: [AnimalsController, SpeciesController],
    providers: [AnimalsService, SpeciesService]
})
export class AnimalsModule {}
