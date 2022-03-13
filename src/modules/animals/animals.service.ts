import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { UpdateAnimalDTO } from './dto/update-animal.dto';
import { Animal } from './entity/animal.entity';
import { Species } from './entity/species.entity';

@Injectable()
export class AnimalsService {
    constructor(
        @InjectRepository(Animal) private repository: Repository<Animal>,
        @InjectRepository(Species)
        private speciesRepository: Repository<Species>,
        private usersService: UsersService
    ) {}

    async create(dto: CreateAnimalDTO, owner: User): Promise<Animal> {
        const animal = new Animal();

        const specie = await this.speciesRepository.findOne(dto.speciesId);
        if (!specie) {
            throw new NotFoundException(
                `specie with id '${dto.speciesId}' does not exist`
            );
        }

        animal.species = specie;
        animal.sexe = dto.sexe;
        animal.name = dto.name;
        animal.birthDate = dto.birthDate;
        animal.comment = dto.comment;
        animal.createDate = new Date();
        animal.images = [];

        const animalDB = await this.repository.save(animal);
        await this.usersService.addAnimalToUser(animalDB, owner);
        return animalDB;
    }

    async getAll(): Promise<Animal[]> {
        return await this.repository.find();
    }

    async getById(id: number): Promise<Animal> {
        const animalDB = await this.repository.findOne(id, {
            relations: ['owner']
        });
        if (!animalDB) {
            throw new NotFoundException(`No animal with id: ${id}`);
        } else {
            return animalDB;
        }
    }

    async update(id: number, dto: UpdateAnimalDTO): Promise<Animal> {
        const updated = await this.getById(id);
        updated.species = dto.species ?? updated.species;
        updated.sexe = dto.sexe ?? updated.sexe;
        updated.name = dto.name ?? updated.name;
        updated.birthDate = dto.birthDate ?? updated.birthDate;
        updated.comment = dto.comment ?? updated.comment;
        updated.images = dto.images ?? updated.images;

        return await this.repository.save(updated);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }
}
