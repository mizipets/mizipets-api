import {Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Res} from '@nestjs/common';
import {User} from './user.entity';
import {UsersService} from "./users.service";
import {OnlyRoles} from '../authentication/guards/role.decorator';
import {Roles} from '../authentication/enum/roles.emum';

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
        @Query('favorites') favorites: string
    ) {
        const fav = favorites.toLowerCase() === 'true';
        return this.userService.getById(id, fav);
    }

    @Get(':email/user')
    async getUserByEmail(@Param('email')email, @Res() res) {
        const token = await this.userService.getByEmail(email);
        return res.status(HttpStatus.OK).json(token);
    }

    @Post('create')
    async createUser(@Body() userData: User, @Res() res): Promise<any> {
        const token = await this.userService.create(userData);
        return res.status(HttpStatus.OK).json(token);
    }

    @Put(':id/update')
    async update(@Param('id')id, @Body() userData: User): Promise<any>{
        userData.id = id;
        return this.userService.update(userData);
    }

    @Put(':id/close')
    async close(@Param('id')id, @Body() userData: User): Promise<any> {
        userData.id = id;
        userData.closeDate = Date.prototype
        return this.userService.update(userData);
    }
}   
