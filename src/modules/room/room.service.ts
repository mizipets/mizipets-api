import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/user.entity';
import { Message } from './message';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
    constructor(@InjectRepository(Room) private repository: Repository<Room>) {}

    async create(user: User, animal: Animal) {
        const room = new Room();
        room.adoptant = user;
        room.messages = [];
        room.animal = animal;
        room.code = room.getCode();
        await this.repository.save(room);
    }

    async getById(id: number) {
        return await this.repository.findOneOrFail(id);
    }

    async writeMessage(id: number, text: string, userId: number) {
        const message = new Message();
        message.created = new Date();
        message.text = text;
        message.writer = userId;

        const room = await this.getById(id);
        room.messages.push(message);
        return await this.repository.save(room);
    }
}
