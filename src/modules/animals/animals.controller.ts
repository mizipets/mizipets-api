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
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    Req
} from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { AnimalsService } from './animals.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';
import { Favorites } from '../favorites/entities/favorites.entity';
import { Sex } from './enum/sex.enum';
import { RacesService } from './race/races.service';
import { SpeciesService } from './specie/species.service';
import { Race } from './entities/race.entity';
import { Specie } from './entities/specie.entity';
import { Age } from './enum/age.enum';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiTags
} from '@nestjs/swagger';

@ApiTags('Animals')
@Controller('animals')
export class AnimalsController {
    constructor(
        private readonly animalsService: AnimalsService,
        private readonly raceService: RacesService,
        private readonly speciesService: SpeciesService
    ) {}

    @Post()
    @ApiCreatedResponse({
        description: '',
        type: Animal
    })
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async create(@Req() req, @Body() dto: CreateAnimalDTO): Promise<Animal> {
        return this.animalsService.create(dto, req.user);
    }

    @Post('adoption')
    @ApiCreatedResponse({
        description: '',
        type: Animal
    })
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async createAdoption(
        @Req() req,
        @Body() dto: CreateAnimalDTO
    ): Promise<Animal> {
        return this.animalsService.create(dto, req.user, true);
    }

    @Get()
    @ApiOkResponse({
        description: 'Animals retrieved',
        type: [Animal]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAnimals(
        @Req() req,
        @Query('sex') sex: Sex,
        @Query('raceId') raceId: string,
        @Query('specieId') specieId: string,
        @Query('age') age: string,
        @Query('ownerId') ownerId: string,
        @Query('isAdoption') isAdoption: string,
        @Query('isLost') isLost: string,
        @Query('isSwipe') isSwipe: string,
        @Query('limit') limit: string,
        @Query('fetchLastOwner') fetchLastOwner: string
    ): Promise<Animal[]> {
        const params: Search = new Search();

        if (sex) params.sex = sex;
        if (raceId)
            params.race = await this.raceService.getById(parseInt(raceId));
        if (specieId)
            params.specie = await this.speciesService.getById(
                parseInt(specieId)
            );
        if (age) params.age = age;
        if (ownerId) params.ownerId = parseInt(ownerId);
        if (isAdoption) params.isAdoption = isAdoption === 'true';
        if (isLost) params.isLost = isLost === 'true';
        if (fetchLastOwner) params.fetchLastOwner = fetchLastOwner === 'true';

        params.isSwipe = isSwipe === 'true';
        params.limit = limit === 'true';

        return this.animalsService.getAnimal(req.user, params);
    }

    @Get('fetched')
    @ApiOkResponse({
        description: 'Animals fetched',
        type: [Animal]
    })
    @HttpCode(HttpStatus.OK)
    async getFetchedAnimals(): Promise<Animal[]> {
        return this.animalsService.getFetchedAnimals();
    }

    @Put('adoption/:id/like')
    @ApiOkResponse({
        description: 'Likes retrieved',
        type: [Favorites]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async like(@Req() req, @Param('id') id: string): Promise<Favorites> {
        return this.animalsService.like(req.user, parseInt(id));
    }

    @Put('adoption/:id/dislike')
    @ApiOkResponse({
        description: 'Dislikes retrieved',
        type: [Favorites]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async dislike(@Req() req, @Param('id') id: string): Promise<Favorites> {
        return this.animalsService.dislike(req.user, parseInt(id));
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Animal retrieved',
        type: Animal
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(@Param('id') id: string): Promise<Animal> {
        return this.animalsService.getById(parseInt(id));
    }

    @Put(':id')
    @ApiOkResponse({
        description: 'Animal updated',
        type: Animal
    })
    @ApiForbiddenResponse({
        description: "Can't update the animal of someone else!"
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async update(
        @Req() req,
        @Param('id') id: string,
        @Body() dto: UpdateAnimalDTO
    ): Promise<Animal> {
        const animal = await this.animalsService.getById(parseInt(id));
        if (req.user.id !== animal.owner.id && req.user.role !== Roles.ADMIN) {
            throw new ForbiddenException(
                "Can't update the animal of someone else!"
            );
        }
        return this.animalsService.update(parseInt(id), dto);
    }

    @Put(':id/lost')
    @ApiOkResponse({
        description: 'Lost animal updated',
        type: Animal
    })
    @ApiForbiddenResponse({
        description: "Can't update the animal of someone else!"
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async updateLostAnimal(
        @Req() req,
        @Param('id') id: string,
        @Query('isLost') isLost: string
    ): Promise<Animal> {
        const animal = await this.animalsService.getById(parseInt(id));
        if (req.user.id !== animal.owner.id && req.user.role !== Roles.ADMIN) {
            throw new ForbiddenException(
                "Can't update the animal of someone else!"
            );
        }
        const lost = isLost === 'true';
        return this.animalsService.updateLostAnimal(parseInt(id), lost);
    }

    @Delete(':id')
    @ApiNoContentResponse({
        description: 'Animal deleted'
    })
    @ApiForbiddenResponse({
        description: "Can't delete the animal of someone else!"
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async delete(@Req() req, @Param('id') id: string): Promise<void> {
        const animal = await this.animalsService.getById(parseInt(id));
        if (req.user.id !== animal.owner.id && req.user.role !== Roles.ADMIN) {
            throw new ForbiddenException(
                "Can't delete the animal of someone else!"
            );
        }
        const result = await this.animalsService.delete(parseInt(id));
        if (!result) {
            throw new InternalServerErrorException("Cant't delete animal");
        }
        return;
    }

    @Post(':id/report/:userId')
    @ApiNoContentResponse({
        description: 'Animal reported'
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async report(
        @Param('id') animalId: string,
        @Param('userId') userId: string
    ): Promise<void> {
        await this.animalsService.report(parseInt(animalId), parseInt(userId));
    }
}

export class Search {
    sex: Sex;
    race: Race;
    specie: Specie;
    age: string;
    ownerId: number;
    limit: boolean;
    isAdoption: boolean;
    isLost: boolean;
    isSwipe: boolean;
    fetchLastOwner: boolean;
}
