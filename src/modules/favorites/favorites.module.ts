/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-25
 */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { Favorites } from './entities/favorites.entity';
import { FavoritesService } from './favorites.service';
import { AnimalsModule } from '../animals/animals.module';
import { UsersModule } from '../users/users.module';
import { AdvicesModule } from '../advices/advices.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Favorites]),
        forwardRef(() => AdvicesModule),
        forwardRef(() => AnimalsModule),
        forwardRef(() => UsersModule)
    ],
    controllers: [FavoritesController],
    providers: [FavoritesService],
    exports: [FavoritesService]
})
export class FavoritesModule {}
