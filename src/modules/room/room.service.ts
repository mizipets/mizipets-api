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

    async create(user: User, animal: Animal): Promise<Room> {
        const room = new Room();
        room.adoptant = user;
        room.messages = [];
        room.animal = animal;
        room.code = room.getCode();

        return await this.repository.save(room);
    }

    async findByUserAndAnimal(user: User, animal: Animal): Promise<Room> {
        return await this.repository.findOne({
            where: {
                animal: {
                    id: animal.id
                },
                adoptant: {
                    id: user.id
                }
            },
            relations: ['adoptant', 'animal', 'animal.owner', 'animal.race']
        });
    }

    async getById(id: number): Promise<Room> {
        const room: Room = await this.repository.findOne({
            where: { id },
            relations: ['adoptant', 'animal', 'animal.owner', 'animal.race']
        });
        if (!room) throw new NotFoundException(`Room with id: ${id} not found`);
        return room;
    }

    async writeMessage(
        id: number,
        text: string,
        userId: number
    ): Promise<Message> {
        const message = new Message();
        message.created = new Date();
        message.text = text;
        message.writer = userId;

        const room = await this.getById(id);
        room.messages.push(message);

        await this.repository.save(room);
        return message;
    }

    async findByUserId(id: number): Promise<Room[]> {
        return this.repository.find({
            where: [
                {
                    animal: {
                        owner: {
                            id: id
                        }
                    }
                },
                {
                    adoptant: {
                        id: id
                    }
                }
            ],
            relations: ['adoptant', 'animal', 'animal.owner', 'animal.race']
        });
    }
}
