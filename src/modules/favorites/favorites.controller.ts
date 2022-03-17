import { Controller, Delete, Get, Param } from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { ServiceType } from '../services/enums/service-type.enum';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
    constructor(private favoritesService: FavoritesService) {}

    @Get(':userId')
    @OnlyRoles(Roles.STANDARD)
    async getFavoritesOfUser(@Param('userId') userId: string) {
        return await this.favoritesService.getFavoritesOfUser(parseInt(userId));
    }

    @Delete(':userId/:type/:referenceID')
    @OnlyRoles(Roles.STANDARD)
    async removeFavorite(
        @Param('userId') userId: string,
        @Param('type') type: ServiceType,
        @Param('referenceID') referenceID: string
    ) {
        return await this.favoritesService.removeFavorite(
            parseInt(userId),
            type,
            parseInt(referenceID)
        );
    }
}
