/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Req
} from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { AnimalsService } from './animals.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';
import { Favorites } from '../favorites/entities/favorites.entity';

@Controller('animals')
export class AnimalsController {
    constructor(private readonly animalsService: AnimalsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async create(@Req() req, @Body() dto: CreateAnimalDTO): Promise<Animal> {
        return this.animalsService.create(dto, req.user);
    }

    @Post('adoption')
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async favorites(@Req() req, @Body() dto: CreateAnimalDTO): Promise<Animal> {
        return this.animalsService.create(dto, req.user, true);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAll(): Promise<Animal[]> {
        return this.animalsService.getAll();
    }

    @Get('adoption')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getFavorites(@Req() req): Promise<Animal[]> {
        return this.animalsService.getAdoption(req.user);
    }

    @Get('adoption/byOwner')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAdoptionsByOwner(@Req() req): Promise<Animal[]> {
        return this.animalsService.getAdoptionsByOwner(parseInt(req.user.id));
    }

    @Put('adoption/:id/like')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async like(@Req() req, @Param('id') id: string): Promise<Favorites> {
        return this.animalsService.like(req.user, parseInt(id));
    }

    @Put('adoption/:id/dislike')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async dislike(@Req() req, @Param('id') id: string): Promise<Favorites> {
        return this.animalsService.dislike(req.user, parseInt(id));
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(@Param('id') id: number): Promise<Animal> {
        return this.animalsService.getById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async update(
        @Req() req,
        @Param('id') id: number,
        @Body() dto: UpdateAnimalDTO
    ): Promise<Animal> {
        const animal = await this.animalsService.getById(id);
        if (req.user.id !== animal.owner.id && req.user.role !== Roles.ADMIN) {
            throw new ForbiddenException(
                "Can't update the animal of someone else!"
            );
        }
        return this.animalsService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async delete(@Req() req, @Param('id') id: number): Promise<void> {
        const animal = await this.animalsService.getById(id);
        if (req.user.id !== animal.owner.id && req.user.role !== Roles.ADMIN) {
            throw new ForbiddenException(
                "Can't delete the animal of someone else!"
            );
        }
        await this.animalsService.delete(id);
    }
}
