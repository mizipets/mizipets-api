import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
    constructor(private favoritesService: FavoritesService) {}

    @Get(':userId')
    @OnlyRoles(Roles.STANDARD)
    async getFavoritesOfUser(@Param('userId') userId: string) {
        return await this.favoritesService.getFavoritesOfUser(parseInt(userId));
    }
}
