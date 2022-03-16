import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesController } from './favorites.controller';
import { Favorites } from './favorites.entity';
import { FavoritesService } from './favorites.service';

@Module({
    imports: [TypeOrmModule.forFeature([Favorites])],
    controllers: [FavoritesController],
    providers: [FavoritesService],
    exports: [FavoritesService]
})
export class FavoritesModule {}
