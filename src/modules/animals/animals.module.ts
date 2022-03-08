import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { Animal } from './entity/animal.entity';
import { Species } from './entity/species.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Animal, Species]), UsersModule],
    controllers: [AnimalsController],
    providers: [AnimalsService]
})
export class AnimalsModule {}
