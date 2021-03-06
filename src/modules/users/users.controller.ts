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
    Post,
    Put,
    Query,
    Req,
    Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { Roles } from '../authentication/enum/roles.emum';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
    ApiTags,
    ApiOkResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse
} from '@nestjs/swagger';
import { CreateAdminUserDTO } from './dto/create-admin.dto';
import { hash } from 'bcrypt';

const { SUPER_PASSWORD } = process.env;

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get()
    @ApiOkResponse({
        description: 'Users retrieved',
        type: [User]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    async getAll(
        @Query('favorites') favorites: string,
        @Query('animals') animals: string
    ): Promise<User[]> {
        const relations = [];
        if (favorites === 'true') relations.push('favorites');
        if (animals === 'true') relations.push('animals');
        return await this.userService.getAll(relations);
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'User retrieved by id',
        type: User
    })
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
    @ApiOkResponse({
        description: 'User retrieved by email',
        type: User
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    async getByEmail(@Param('email') email: string): Promise<User> {
        return this.userService.getByEmail(email);
    }

    @Put(':id')
    @ApiOkResponse({
        description: 'User updated',
        type: User
    })
    @ApiForbiddenResponse({
        description: "Can't update this user"
    })
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
    @ApiOkResponse({
        description: "User's token updated",
        type: User
    })
    @ApiForbiddenResponse({
        description: "Can't update this user"
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO)
    async updateFlutterToken(
        @Request() req,
        @Param('id') id: string,
        @Body() tokenDTO: { token: string }
    ): Promise<void> {
        if (req.user.id !== parseInt(id) && req.user.role !== Roles.ADMIN)
            throw new ForbiddenException("Can't update this user");
        await this.userService.updateFlutterToken(tokenDTO.token, parseInt(id));
    }

    @Put(':id/lang')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.STANDARD, Roles.PRO)
    async updateLang(
        @Request() req,
        @Param('id') id: string,
        @Body() body: { lang: string }
    ): Promise<void> {
        if (req.user.id !== parseInt(id) && req.user.role !== Roles.ADMIN)
            throw new ForbiddenException("Can't update this user");
        const user = await this.userService.getById(parseInt(id));
        user.preferences.lang = body.lang;
        const updateUser = {
            preferences: user.preferences
        } as UpdateUserDto;

        await this.userService.update(parseInt(id), updateUser);
    }

    @Put(':id/close')
    @ApiNoContentResponse({
        description: 'User account closed'
    })
    @ApiForbiddenResponse({
        description: "Can't close this user account"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.STANDARD, Roles.PRO, Roles.ADMIN)
    async close(@Request() req, @Param('id') id: string): Promise<void> {
        if (req.user.id !== parseInt(id) && req.user.role !== Roles.ADMIN)
            throw new ForbiddenException("Can't close this user account");
        return this.userService.close(parseInt(id));
    }

    @Post('admin')
    @HttpCode(HttpStatus.OK)
    async createAdminAccount(
        @Req() req,
        @Body() body: CreateAdminUserDTO
    ): Promise<User> {
        if (body.superpassword !== SUPER_PASSWORD) {
            throw new ForbiddenException();
        }
        body.user.password = await hash(body.user.password, 10);
        return await this.userService.create(body.user, Roles.ADMIN);
    }
}
