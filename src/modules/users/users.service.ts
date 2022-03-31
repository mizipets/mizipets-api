/**
 * @author Julien DA CORTE & Latif SAGNA
 * @create 2022-03-11
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
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

        return this.repository.find({
            relations: relations
        });
    }

    async getById(id: number, options: FindUserOptions = {}): Promise<User> {
        const relations = [];

        if (options.favorites) relations.push('favorites');
        if (options.animals) relations.push('animals');

        const user: User = await this.repository.findOne({
            where: { id: id },
            relations: relations
        });

        if (!user)
            throw new NotFoundException(`User with id: ${id} not found`);
        user.password = undefined;
        return user;
    }

    async getByEmail(email: string, addPassword= false): Promise<User> {
        let user: User;

        if(addPassword) {
            user = await this.repository.createQueryBuilder('user')
                .addSelect('user.password')
                .where('user.email = :email', {
                    email: email
                })
                .getOne();
        } else {
            user = await this.repository.findOne({
                where: { email: email }
            });
        }

        if (!user)
            throw new NotFoundException(`User with email: ${email} not found`);

        return user;
    }

    async isEmailExist(email: string): Promise<boolean> {
        const user: User = await this.repository.findOne({
            where: { email: email }
        });
        return !!user;
    }

    async create(userDto: CreateUserDto): Promise<User> {
        const favorites = await this.favoritesService.createFavoritesForUser();
        const newUser = new User();
        let role: Roles = Roles.STANDARD;

        if (userDto.shelter) role = Roles.PRO;

        newUser.email = userDto.email;
        newUser.password = userDto.password;
        newUser.firstname = userDto.firstname;
        newUser.lastname = userDto.lastname;
        newUser.address = userDto.address;
        newUser.photoUrl = null;
        newUser.role = role;
        newUser.createDate = new Date();
        newUser.closeDate = null;
        newUser.animals = [];
        newUser.favorites = favorites;
        newUser.preferences = userDto.preferences;
        newUser.shelter = userDto.shelter;

        this.repository.create(newUser);
        return this.repository.save(newUser);
    }

    async update(id: number, userDto: UpdateUserDto): Promise<User> {
        const user: User = await this.getById(id);

        user.firstname = userDto.firstname ?? user.firstname;
        user.lastname = userDto.lastname ?? user.lastname;
        user.email = userDto.email ?? user.email;
        user.address = userDto.address ?? user.address;
        user.preferences = userDto.preferences ?? user.preferences;
        user.shelter = userDto.shelter ?? user.shelter;

        return this.repository.save(user);
    }

    async close(id: number): Promise<void> {
        const user: User = await this.getById(id);
        user.closeDate = new Date();
        await this.repository.save(user);
    }

    async addAnimalToUser(animal: Animal, owner: User): Promise<User> {
        const user = await this.getById(owner.id, { animals: true });
        user.animals.push(animal);
        return this.repository.save(user);
    }
}
