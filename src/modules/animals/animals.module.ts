import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { Animal } from './entity/animal.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Animal]), UsersModule],
    controllers: [AnimalsController],
    providers: [AnimalsService]
})
export class AnimalsModule {}
