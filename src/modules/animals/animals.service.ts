/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import {
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Not, Repository } from 'typeorm';
import {
    AdoptionReferences,
    Favorites
} from '../favorites/entities/favorites.entity';
import { FavoritesService } from '../favorites/favorites.service';
import { ServiceType } from '../services/enums/service-type.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';
import { Race } from './entities/race.entity';
import { Species } from './entities/species.entity';
import { JwtPayloadDto } from '../authentication/dto/jwt-payload.dto';
import { Search } from './animals.controller';
import { Roles } from '../authentication/enum/roles.emum';

@Injectable()
export class AnimalsService {
    constructor(
        @InjectRepository(Animal)
        private readonly repository: Repository<Animal>,
        @InjectRepository(Race)
        private readonly raceRepository: Repository<Race>,
        @InjectRepository(Species)
        private readonly speciesRepository: Repository<Species>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => FavoritesService))
        private favoritesService: FavoritesService
    ) {}

    async create(
        dto: CreateAnimalDTO,
        owner: User,
        isAdoption = false
    ): Promise<Animal> {
        const animal = new Animal();

        const race = await this.raceRepository.findOne(dto.raceId, {
            relations: ['species']
        });
        if (!race) {
            throw new NotFoundException(
                `race with id '${dto.raceId}' does not exist`
            );
        }

        const specie = await this.speciesRepository.findOne(race.species.id);
        if (!specie) {
            throw new NotFoundException(
                `specie with id '${race.species.id}' does not exist`
            );
        }

        animal.race = race;
        animal.sex = dto.sex;
        animal.name = dto.name;
        animal.birthDate = dto.birthDate;
        animal.isAdoption = isAdoption;
        animal.isLost = false;
        animal.comment = dto.comment;
        animal.createDate = new Date();
        animal.images = [];

        const animalDB = await this.repository.save(animal);
        await this.usersService.addAnimalToUser(animalDB, owner);
        return animalDB;
    }

    async getById(id: number): Promise<Animal> {
        const animalDB = await this.repository.findOne(id, {
            relations: ['race', 'race.species', 'owner']
        });
        if (!animalDB) {
            throw new NotFoundException(`No animal with id: ${id}`);
        } else {
            return animalDB;
        }
    }

    async getByIds(
        ids: number[],
        relations = ['race', 'race.species', 'owner']
    ): Promise<Animal[]> {
        return await this.repository.find({
            where: { id: In(ids) },
            relations
        });
    }

    async getAdoption(user: User, params: Search): Promise<Animal[]> {
        const userDB = await this.usersService.getById(user.id, ['favorites']);

        const reference = userDB.favorites.find(
            (favorite) => favorite.type === ServiceType.ADOPTION
        ).reference as AdoptionReferences;

        const avoidIds = [...reference.disliked, ...reference.liked];

        const originalQuery: any = {
            id: Not(In(avoidIds))
        };
        if (params.sex) originalQuery.sex = params.sex;
        if (params.race) originalQuery.race = params.race;
        if (params.species)
            originalQuery.race = { species: { id: params.species.id } };

        if (params.isAdoption !== undefined) {
            originalQuery.isAdoption = params.isAdoption;
        }

        const currentOwnerQuery = Object.assign({}, originalQuery);
        currentOwnerQuery.owner = {
            id: params.ownerId ? params.ownerId : Not(user.id)
        };

        const lastOwnerQuery = Object.assign({}, originalQuery);
        lastOwnerQuery.lastOwner = {
            id: params.ownerId ? params.ownerId : Not(user.id)
        };

        const queries: any[] = [currentOwnerQuery];

        if (user.role === Roles.PRO) {
            queries.push(lastOwnerQuery);
        }

        return await this.repository.find({
            where: queries,
            relations: ['race', 'race.species', 'owner'],
            take: params.limit ? 5 : null
        });
    }

    async update(id: number, dto: UpdateAnimalDTO): Promise<Animal> {
        const updated = await this.getById(id);

        let race: Race;
        if (dto.raceId) {
            race = await this.raceRepository.findOne(dto.raceId, {
                relations: ['species']
            });
        }
        updated.race = race ?? updated.race;
        updated.sex = dto.sex ?? updated.sex;
        updated.name = dto.name ?? updated.name;
        updated.birthDate = dto.birthDate ?? updated.birthDate;
        updated.comment = dto.comment ?? updated.comment;
        return await this.repository.save(updated);
    }

    async updateImages(id: number, image: string): Promise<void> {
        const updated = await this.getById(id);

        updated.images.push(image);
        await this.repository.save(updated);
    }

    async delete(id: number): Promise<DeleteResult> {
        return this.repository.delete(id);
    }

    async like(token: JwtPayloadDto, new_id: number): Promise<Favorites> {
        const user: User = await this.usersService.getById(token.id, [
            'favorites',
            'favorites.user'
        ]);
        const favorite = user.favorites.find(
            (favorite) => favorite.type === ServiceType.ADOPTION
        );
        const reference = favorite.reference as AdoptionReferences;

        const animal = await this.getById(new_id);

        if (animal.owner.id === token.id) {
            throw new ForbiddenException("Can't like your own adoption");
        }

        if (!reference.liked.includes(new_id)) {
            reference.liked.push(new_id);
            reference.disliked = reference.disliked.filter(
                (id) => id !== new_id
            );
            favorite.reference = reference;
            return this.favoritesService.update(favorite.id, favorite);
        } else {
            return favorite;
        }
    }

    async dislike(token: JwtPayloadDto, new_id: number): Promise<Favorites> {
        const user: User = await this.usersService.getById(token.id, [
            'favorites',
            'favorites.user'
        ]);
        const favorite = user.favorites.find(
            (favorite) => favorite.type === ServiceType.ADOPTION
        );
        const reference = favorite.reference as AdoptionReferences;

        const animal = await this.getById(new_id);

        if (animal.owner.id === token.id) {
            throw new ForbiddenException("Can't dislike your own adoption");
        }

        if (!reference.disliked.includes(new_id)) {
            reference.disliked.push(new_id);
            reference.liked = reference.liked.filter((id) => id !== new_id);
            favorite.reference = reference;
            return this.favoritesService.update(favorite.id, favorite);
        } else {
            return favorite;
        }
    }
}
