/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put,
    Query,
    Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { Roles } from '../authentication/enum/roles.emum';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    async getAll(
        @Query('favorites') favorites: string,
        @Query('animals') animals: string
    ): Promise<User[]> {
        return this.userService.getAll({
            favorites: favorites === 'true',
            animals: animals === 'true'
        });
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(
        @Param('id') id: number,
        @Query('favorites') favorites: string,
        @Query('animals') animals: string
    ): Promise<User> {
        return this.userService.getById(id, {
            favorites: favorites === 'true',
            animals: animals === 'true'
        });
    }

    @Get('email/:email')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    async getByEmail(@Param('email') email: string): Promise<User> {
        return this.userService.getByEmail(email);
    }

    @Put(':id/update')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async update(
        @Request() req,
        @Param('id') id: number,
        @Body() userDto: UpdateUserDto
    ): Promise<User> {
        if (req.user.id !== id && req.user.role !== Roles.ADMIN)
            throw new ForbiddenException("Can't update this user");
        return this.userService.update(id, userDto);
    }

    @Put(':id/close')
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async close(@Request() req, @Param('id') id: number): Promise<void> {
        if (req.user.id !== id && req.user.role !== Roles.ADMIN)
            throw new ForbiddenException("Can't close this user account");
        return this.userService.close(id);
    }
}
