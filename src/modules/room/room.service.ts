/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { Message } from './messages/message';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room) private readonly repository: Repository<Room>
    ) {}

    async create(user: User, animal: Animal): Promise<void> {
        const room = new Room();
        room.adoptant = user;
        room.messages = [];
        room.animal = animal;
        room.code = room.getCode();

        await this.repository.save(room);
    }

    async getById(id: number): Promise<Room> {
        const room: Room = await this.repository.findOne(id);
        if (!room) throw new NotFoundException(`Room with id: ${id} not found`);

        return room;
    }

    async writeMessage(
        id: number,
        text: string,
        userId: number
    ): Promise<Room> {
        const message = new Message();
        message.created = new Date();
        message.text = text;
        message.writer = userId;

        const room = await this.getById(id);

        room.messages.push(message);
        return this.repository.save(room);
    }
}
