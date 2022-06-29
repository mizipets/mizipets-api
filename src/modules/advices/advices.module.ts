import { forwardRef, Module } from '@nestjs/common';
import { AdvicesService } from './advices.service';
import { AdvicesController } from './advices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advice } from './entities/advices.entity';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Advice]),
        forwardRef(() => FavoritesModule)
    ],
    providers: [AdvicesService],
    controllers: [AdvicesController],
    exports: [AdvicesService]
})
export class AdvicesModule {}
