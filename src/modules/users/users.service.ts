import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../authentication/enum/roles.emum';
import { Animal } from '../animals/entities/animal.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}

    async getAll(): Promise<User[]> {
        return this.repository.find({ relations: ['animals'] });
    }

    async getById(id: number): Promise<User> {
        return this.repository.findOne({
            where: {
                id: id
            },
            relations: ['animals']
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
        const newUser = {
            email: data.email,
            password: data.password,
            firstname: data.firstname,
            lastname: data.lastname,
            photoUrl: null,
            role: Roles.STANDARD,
            createDate: new Date(),
            closeDate: null,
            animals: []
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
