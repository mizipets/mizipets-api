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

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD)
    async getAll(
        @Query('favorites') favorites: string,
        @Query('animals') animals: string
    ) {
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
    ) {
        return this.userService.getById(id, {
            favorites: favorites === 'true',
            animals: animals === 'true'
        });
    }

    @Get('email/:email')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async getByEmail(@Param('email') email: string) {
        return this.userService.getByEmail(email);
    }

    @Put(':id/update')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async update(
        @Request() req,
        @Param('id') id,
        @Body() userDto: UpdateUserDto
    ): Promise<any> {
        if (req.user.id !== id)
            throw new ForbiddenException("Can't update this user");
        return this.userService.update(id, userDto);
    }

    @Put(':id/close')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async close(@Request() req, @Param('id') id): Promise<any> {
        if (req.user.id !== id)
            throw new ForbiddenException("Can't close this user account");
        return this.userService.close(id);
    }
}
