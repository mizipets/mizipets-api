import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository, UpdateResult} from "typeorm";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Roles} from '../authentication/enum/roles.emum';
import {Animal} from '../animals/entities/animal.entity';
import {FavoritesService} from '../favorites/favorites.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repository: Repository<User>,
        private favoritesService: FavoritesService
    ) {}

    async getAll(favorites = false): Promise<User[]> {
        return this.repository.find({
            relations: favorites ? ['animals', 'favorites'] : ['animals']
        });
    }

    async getById(id: number, favorites= false): Promise<User> {
        return this.repository.findOne({
            where: {
                id: id
            },
            relations: favorites ? ['animals', 'favorites'] : ['animals']
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
        const favorites = await this.favoritesService.createFavoritesForUser();

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
            favorites: favorites
        } as User;

        this.repository.create(newUser);
        return await this.repository.save(newUser);
    }

    async update(data: UpdateUserDto): Promise<UpdateResult> {
        return this.repository.update(data.id, data);
    }

    async addAnimalToUser(animal: Animal, user: User): Promise<User> {
        user.animals.push(animal);
        return this.repository.save(user);
    }
}
