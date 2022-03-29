/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../authentication/enum/roles.emum';
import { Animal } from '../animals/entities/animal.entity';
import { FavoritesService } from '../favorites/favorites.service';

export interface FindUserOptions {
    favorites?: boolean;
    animals?: boolean;
}

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly repository: Repository<User>,
        private readonly favoritesService: FavoritesService
    ) {}

    async getAll(options: FindUserOptions = {}): Promise<User[]> {
        const relations = [];

        if (options.favorites) relations.push('favorites');
        if (options.animals) relations.push('animals');

        return this.repository.find({ relations: relations });
    }

    async getById(id: number, options: FindUserOptions = {}): Promise<User> {
        const relations = [];

        if (options.favorites) relations.push('favorites');
        if (options.animals) relations.push('animals');

        const user: User = await this.repository.findOne({
            where: { id: id },
            relations: relations
        });

        if (!user) throw new NotFoundException(`User with id: ${id} not found`);
        return user;
    }

    async getByEmail(email: string): Promise<User> {
        const user: User = await this.repository.findOne({
            where: { email: email }
        });

        if (!user)
            throw new NotFoundException(`User with email: ${email} not found`);
        return user;
    }

    async create(data: CreateUserDto): Promise<User> {
        const favorites = await this.favoritesService.createFavoritesForUser();

        const newUser = {
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
            address: data.address,
            photoUrl: null,
            preferences: data.preferences,
            role: Roles.STANDARD,
            createDate: new Date(),
            closeDate: null,
            animals: [],
            favorites: favorites
        } as User;

        this.repository.create(newUser);
        return await this.repository.save(newUser);
    }

    async update(id, userDto: UpdateUserDto): Promise<UpdateResult> {
        return this.repository.update(id, userDto);
    }

    async close(id: string): Promise<void> {
        //@TODO
    }

    async addAnimalToUser(animal: Animal, owner: User): Promise<User> {
        const user = await this.getById(owner.id, { animals: true });
        user.animals.push(animal);
        return this.repository.save(user);
    }
}
