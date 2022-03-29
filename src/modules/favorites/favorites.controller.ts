/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-25
 */
import {Controller, Delete, Get, HttpCode, HttpStatus, Param} from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { ServiceType } from '../services/enums/service-type.enum';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
    constructor(private readonly favoritesService: FavoritesService) {}

    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async getFavoritesOfUser(@Param('userId') userId: string) {
        return this.favoritesService.getFavoritesOfUser(parseInt(userId));
    }

    @Delete(':userId/:type/:referenceID')
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async removeFavorite(
        @Param('userId') userId: string,
        @Param('type') type: ServiceType,
        @Param('referenceID') referenceID: string
    ) {
        return this.favoritesService.removeFavorite(parseInt(userId), type, parseInt(referenceID));
    }
}
