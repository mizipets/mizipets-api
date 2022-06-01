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
    ) {
        const relations = [];
        if (favorites === 'true') relations.push('favorites');
        if (animals === 'true') relations.push('animals');
        return await this.userService.getAll(relations);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(
        @Param('id') id: string,
        @Query('favorites') favorites: string,
        @Query('animals') animals: string
    ): Promise<User> {
        const relations = [];
        if (favorites === 'true') relations.push('favorites');
        if (animals === 'true') relations.push('animals');
        return await this.userService.getById(parseInt(id), relations);
    }

    @Get('email/:email')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    async getByEmail(@Param('email') email: string): Promise<User> {
        return this.userService.getByEmail(email);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async update(
        @Request() req,
        @Param('id') id: string,
        @Body() userDto: UpdateUserDto
    ): Promise<User> {
        if (req.user.id !== parseInt(id) && req.user.role !== Roles.ADMIN)
            throw new ForbiddenException("Can't update this user");
        return this.userService.update(parseInt(id), userDto);
    }

    @Put(':id/flutterToken')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO)
    async updateFlutterToken(
        @Request() req,
        @Param('id') id: string,
        @Body() tokenDTO: { token: string }
    ): Promise<string> {
        if (req.user.id !== parseInt(id) && req.user.role !== Roles.ADMIN)
            throw new ForbiddenException("Can't update this user");
        return this.userService.updateFlutterToken(
            tokenDTO.token,
            parseInt(id)
        );
    }

    @Put(':id/close')
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async close(@Request() req, @Param('id') id: string): Promise<void> {
        if (req.user.id !== parseInt(id) && req.user.role !== Roles.ADMIN)
            throw new ForbiddenException("Can't close this user account");
        return this.userService.close(parseInt(id));
    }
}
