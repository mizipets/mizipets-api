import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../authentication/enum/roles.emum';
import { Animal } from '../animals/entities/animal.entity';
import { Favorites } from './Favorites.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repository: Repository<User>,
        @InjectRepository(Favorites)
        private seenRepository: Repository<Favorites>
    ) {}

    async getAll(Favorites = false): Promise<User[]> {
        return this.repository.find({
            relations: Favorites ? ['animals', 'Favorites'] : ['animals']
        });
    }

    async getById(id: number, Favorites = false): Promise<User> {
        return this.repository.findOne({
            where: {
                id: id
            },
            relations: Favorites ? ['animals', 'Favorites'] : ['animals']
        });
    }

    async getByEmail(email: string): Promise<User> {
        return this.repository.findOne({
            where: {
                email: email
            }
        });
    }

    async create(data: CreateUserDto): Promise<User> {
        const seen = new Favorites();
        seen.disliked = [];
        const seenDB = await this.seenRepository.save(seen);

        const newUser = {
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
            photoUrl: null,
            role: Roles.STANDARD,
            createDate: new Date(),
            closeDate: null,
            animals: [],
            Favorites: seenDB
        };
        const user: User = this.repository.create(newUser);
        await this.repository.save(newUser);
        return user;
    }

    async addAnimalToUser(animal: Animal, user: User): Promise<User> {
        user.animals.push(animal);
        return this.repository.save(user);
    }
}
