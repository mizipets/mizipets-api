import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Column, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from '../authentication/enum/roles.emum';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}

    async getAll(): Promise<User[]> {
        return this.repository.find();
    }

    async getById(id: number): Promise<User> {
        return this.repository.findOne({
            where: {
                id: id
            }
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
            closeDate: null
        };
        const user: User = this.repository.create(newUser);
        await this.repository.save(newUser);
        return user;
    }
}
