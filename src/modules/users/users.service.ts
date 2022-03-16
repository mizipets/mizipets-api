import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repository: Repository<User>) {}

    async getAll(): Promise<User[]> {
        return this.repository.find();
    }

    async getById(id: number): Promise<User> {
        return this.repository.findOne({
            where: {
                id: id,
            }
        });
    }

    async getByEmail(email: string): Promise<User> {
        return this.repository.findOne({
            where: {
                email: email,
            }
        });
    }

    async create(data: CreateUserDto): Promise<User> {
        const user: User = this.repository.create(data);
        await this.repository.save(data);
        return user;
    }

    async update(data: UpdateUserDto): Promise<UpdateResult>{
        return this.repository.update(data.id, data);
        
    }

}

