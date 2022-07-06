/**
 * @author Maxime D'HARBOULLE && Julien DA CORTE
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
import { In, Not, Repository } from 'typeorm';
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
import { Specie } from './entities/specie.entity';
import { JwtPayloadDto } from '../authentication/dto/jwt-payload.dto';
import { Search } from './animals.controller';
import { Roles } from '../authentication/enum/roles.emum';
import { S3Service } from '../s3/s3.service';
import { RoomService } from '../room/room.service';
import { Age } from './enum/age.enum';

@Injectable()
export class AnimalsService {
    constructor(
        @InjectRepository(Animal)
        private readonly repository: Repository<Animal>,
        @InjectRepository(Race)
        private readonly raceRepository: Repository<Race>,
        @InjectRepository(Specie)
        private readonly speciesRepository: Repository<Specie>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => FavoritesService))
        private favoritesService: FavoritesService,
        @Inject(forwardRef(() => S3Service))
        private s3Service: S3Service,
        @Inject(forwardRef(() => RoomService))
        private roomService: RoomService
    ) {}

    async create(
        dto: CreateAnimalDTO,
        owner: User,
        isAdoption = false
    ): Promise<Animal> {
        const animal = new Animal();

        const race = await this.raceRepository.findOne(dto.raceId, {
            relations: ['specie']
        });
        if (!race) {
            throw new NotFoundException(
                `race with id '${dto.raceId}' does not exist`
            );
        }

        const specie = await this.speciesRepository.findOne(race.specie.id);
        if (!specie) {
            throw new NotFoundException(
                `specie with id '${race.specie.id}' does not exist`
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
        const animal = await this.repository.findOne(id, {
            where: {
                deletedDate: null
            },
            relations: ['race', 'race.specie', 'owner', 'reminders', 'reports']
        });
        if (!animal) {
            throw new NotFoundException(`No animal with id: ${id}`);
        } else {
            animal.owner.removeSensitiveData();
            return animal;
        }
    }

    async getByIds(
        ids: number[],
        relations = ['race', 'race.specie', 'owner', 'reminders']
    ): Promise<Animal[]> {
        const animals = await this.repository.find({
            where: { id: In(ids), deletedDate: null },
            relations
        });

        return animals.map((animal: Animal) => {
            if (Object.keys(animal).includes('owner'))
                animal.owner.removeSensitiveData();
            return animal;
        });
    }

    async getAnimal(user: User, params: Search): Promise<Animal[]> {
        const userDB = await this.usersService.getById(user.id, ['favorites']);
        const reference = userDB.favorites.find(
            (favorite) => favorite.type === ServiceType.ADOPTION
        ).reference as AdoptionReferences;

        const avoidIds = [...reference.disliked, ...reference.liked];

        const originalQuery: any = {
            id: Not(In(avoidIds)),
            deletedDate: null
        };

        if (params.sex) originalQuery.sex = params.sex;
        if (params.race) originalQuery.race = params.race;
        if (params.specie)
            originalQuery.race = { specie: { id: params.specie.id } };

        if (params.isAdoption !== undefined) {
            originalQuery.isAdoption = params.isAdoption;
        }
        if (params.isLost !== undefined) originalQuery.isLost = params.isLost;

        const currentOwnerQuery = Object.assign({}, originalQuery);
        currentOwnerQuery.owner = {
            id: params.ownerId
                ? params.ownerId
                : Not(params.isSwipe ? user.id : -1)
        };

        const lastOwnerQuery = Object.assign({}, originalQuery);
        lastOwnerQuery.lastOwner = {
            id: params.ownerId ? params.ownerId : Not(user.id)
        };

        const queries: any[] = [currentOwnerQuery];

        if (user.role === Roles.PRO && params.fetchLastOwner) {
            queries.push(lastOwnerQuery);
        }

        let animals = await this.repository.find({
            where: queries,
            relations: ['race', 'race.specie', 'owner', 'reminders'],
            take: params.limit ? 5 : null
        });

        if (params.age) {
            const range = this.getAgeRange(params.age);
            animals = animals.filter(
                (animal) =>
                    animal.birthDate.getTime() < range[0].getTime() &&
                    animal.birthDate.getTime() > range[1].getTime()
            );
        }

        return animals.map((animal: Animal) => {
            animal.owner.removeSensitiveData();
            return animal;
        });
    }

    async getFetchedAnimals(): Promise<Animal[]> {
        return this.repository.find({
            where: {
                isAdoption: true,
                deletedDate: Not(null)
            },
            order: { id: 'DESC' },
            take: 5
        });
    }

    async update(id: number, dto: UpdateAnimalDTO): Promise<Animal> {
        const updated = await this.getById(id);

        let race: Race;
        if (dto.raceId) {
            race = await this.raceRepository.findOne(dto.raceId, {
                relations: ['specie']
            });
        }
        updated.race = race ?? updated.race;
        updated.sex = dto.sex ?? updated.sex;
        updated.name = dto.name ?? updated.name;
        updated.birthDate = dto.birthDate ?? updated.birthDate;
        updated.comment = dto.comment ?? updated.comment;
        updated.images = dto.images ?? updated.images;
        return await this.repository.save(updated);
    }

    async updateLostAnimal(id: number, isLost: boolean): Promise<Animal> {
        await this.repository
            .createQueryBuilder()
            .update(Animal)
            .set({ isLost: isLost })
            .where('id = :id', { id: id })
            .execute();
        return this.getById(id);
    }

    async save(animal: Animal): Promise<Animal> {
        return await this.repository.save(animal);
    }

    async updateImages(id: number, image: string): Promise<void> {
        const updated = await this.getById(id);

        updated.images.push(image);
        await this.repository.save(updated);
    }

    async delete(id: number): Promise<boolean> {
        await this.favoritesService.removeFromAllUser(id, ServiceType.ADOPTION);
        await this.roomService.closeAllWithAnimal(id);
        const result = await this.repository
            .createQueryBuilder()
            .update(Animal)
            .set({ deletedDate: new Date() })
            .where('id = :id', { id: id })
            .execute();

        return result.affected == 1;
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

    async report(animalId: number, userId: number) {
        const animal = await this.getById(animalId);
        const user = await this.usersService.getById(userId);

        animal.reports.push(user);
        await this.repository.save(animal);
    }

    getAgeRange(age: string): Date[] {
        const currentTime = new Date();
        let lower: Date;
        let upper: Date;
        switch (age) {
            case Age.a:
                lower = currentTime;
                upper = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 1)
                );
                break;

            case Age.b:
                lower = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 1)
                );
                upper = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 2)
                );
                break;

            case Age.c:
                lower = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 2)
                );
                upper = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 4)
                );
                break;

            case Age.d:
                lower = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 4)
                );
                upper = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 6)
                );
                break;

            case Age.e:
                lower = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 6)
                );
                upper = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 8)
                );
                break;

            case Age.f:
                lower = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 8)
                );
                upper = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 10)
                );
                break;

            case Age.g:
                lower = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 10)
                );
                upper = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 12)
                );
                break;

            case Age.h:
                lower = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 12)
                );
                upper = new Date(
                    new Date().setFullYear(currentTime.getFullYear() - 30)
                );
                break;

            default:
                break;
        }

        return [lower, upper];
    }
}
