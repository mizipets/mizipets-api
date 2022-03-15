import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Not, Repository } from 'typeorm';
import { FavoritesService } from '../favorites/Favorites.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';
import { Race } from './entities/race.entity';
import { Species } from './entities/species.entity';

@Injectable()
export class AnimalsService {
    constructor(
        @InjectRepository(Animal) private repository: Repository<Animal>,
        @InjectRepository(Race)
        private raceRepository: Repository<Race>,
        @InjectRepository(Species)
        private speciesRepository: Repository<Species>,
        private usersService: UsersService,
        private FavoritesService: FavoritesService
    ) {}

    async create(
        dto: CreateAnimalDTO,
        owner: User,
        isFavorites = false
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
        animal.isFavorites = isFavorites;
        animal.isLost = false;
        animal.comment = dto.comment;
        animal.createDate = new Date();
        animal.images = [];

        const animalDB = await this.repository.save(animal);
        await this.usersService.addAnimalToUser(animalDB, owner);
        return animalDB;
    }

    async getAll(): Promise<Animal[]> {
        return await this.repository.find({
            relations: ['race', 'race.species', 'owner']
        });
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

    async getFavoritess(user: User): Promise<Animal[]> {
        const userDB = this.usersService.getById(user.id, true);
        return await this.repository
            .createQueryBuilder()
            .select('Favorites')
            .from(Animal, 'Favorites')
            .where('Favorites.isFavorites = :isFavorites', {
                isFavorites: true
            })
            .andWhere({ id: Not(In((await userDB).Favorites.disliked)) })
            .getMany();
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
        updated.images = dto.images ?? updated.images;

        return await this.repository.save(updated);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    async likeFavorites(user: User, id: number): Promise<any> {
        return await this.repository.delete(id);
    }

    async dislikeFavorites(user: User, id: number): Promise<any> {
        const userDB = await this.usersService.getById(user.id, true);
        if (!userDB.Favorites.disliked.includes(id)) {
            userDB.Favorites.disliked.push(id);
        }
        return await this.FavoritesService.update(
            userDB.Favorites.id,
            userDB.Favorites
        );
    }
}
