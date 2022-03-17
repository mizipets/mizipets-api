import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { Roles } from '../authentication/enum/roles.emum';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.API, Roles.STANDARD)
    @Get()
    async getAll() {
        return await this.userService.getAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async getById(
        @Param('id') id: number,
        @Query('Favorites') Favorites: string
    ) {
        return this.userService.getById(id, Favorites === 'true');
    }
}
