import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/user.entity';
import { Room } from './room.entity';

@Injectable()
export class RoomService {
    constructor(@InjectRepository(Room) private repository: Repository<Room>) {}

    async create(user: User, animal: Animal) {
        const room = new Room();
        room.adoptant = user;
        room.animal = animal;
        room.code = room.getCode();
        await this.repository.save(room);
    }
}
