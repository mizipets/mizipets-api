import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { Animal } from './entity/animal.entity';

@Injectable()
export class AnimalsService {
    constructor(
        @InjectRepository(Animal) private repository: Repository<Animal>,
        private usersService: UsersService
    ) {}

    async create(dto: CreateAnimalDTO, owner: User): Promise<Animal> {
        const animal = new Animal();

        animal.species = dto.species;
        animal.race = dto.race;
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
        return await this.repository.findOne(id);
    }
}
