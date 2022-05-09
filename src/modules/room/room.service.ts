/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { Message, MessageType } from './entities/message';
import { Room } from './entities/room.entity';
import { MsgToRoom, RoomGateway } from './room.gateway';
import { v4 as uuid } from 'uuid';
import { AnimalsService } from '../animals/animals.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ServiceType } from '../services/enums/service-type.enum';

@Injectable()
export class RoomService {
    constructor(
        @Inject(forwardRef(() => RoomGateway))
        private messageGateway: RoomGateway,
        private animalsService: AnimalsService,
        private favoritesService: FavoritesService,
        @InjectRepository(Room) private readonly repository: Repository<Room>
    ) {}

    async create(user: User, animal: Animal): Promise<Room> {
        const room = new Room();
        room.closed = false;
        room.requestGive = false;
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
        userId: number,
        type: MessageType = MessageType.text
    ): Promise<Message> {
        const message = new Message();
        message.created = new Date();
        message.text = text;
        message.writer = userId;
        message.type = type;
        message.id = uuid();

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

    async requestGive(roomId: number) {
        const roomDB = await this.getById(roomId);
        roomDB.requestGive = true;
        await this.repository.save(roomDB);

        const msgRoom: MsgToRoom = {
            roomCode: roomDB.code,
            roomId: roomDB.id,
            userId: roomDB.animal.owner.id.toString(),
            msg: `${roomDB.animal.owner.firstname} wants to give ${roomDB.animal.name}`,
            type: MessageType.give
        };

        await this.messageGateway.sendMessage(null, msgRoom);
    }

    async acceptRequestGive(roomId: number, messageId: string, user: User) {
        const roomDB = await this.getById(roomId);

        roomDB.messages = roomDB.messages.filter((msg) => msg.id != messageId);
        roomDB.requestGive = false;

        const animal = roomDB.animal;

        animal.isAdoption = false;
        animal.lastOwner = animal.owner;
        animal.owner = roomDB.adoptant;

        this.favoritesService.removeFavorite(
            animal.owner.id,
            ServiceType.ADOPTION,
            animal.id
        );

        roomDB.closed = true;
        roomDB.animal = await this.animalsService.save(animal);

        await this.repository.save(roomDB);

        const msgRoom: MsgToRoom = {
            roomCode: roomDB.code,
            roomId: roomDB.id,
            userId: roomDB.animal.owner.id.toString(),
            msg: `${roomDB.animal.owner.firstname} accepted receiving ${roomDB.animal.name}`,
            type: MessageType.accepted
        };
        await this.messageGateway.sendMessage(null, msgRoom);

        const msgCloseRoom: MsgToRoom = {
            roomCode: roomDB.code,
            roomId: roomDB.id,
            userId: roomDB.animal.owner.id.toString(),
            msg: `Conversation ended`,
            type: MessageType.close
        };
        await this.messageGateway.sendMessage(null, msgCloseRoom);

        // TODO: notifs
    }

    async refuseRequestGive(roomId: number, messageId: string, user: User) {
        const roomDB = await this.getById(roomId);

        roomDB.messages = roomDB.messages.filter((msg) => msg.id != messageId);
        roomDB.requestGive = false;

        await this.repository.save(roomDB);

        const msgRoom: MsgToRoom = {
            roomCode: roomDB.code,
            roomId: roomDB.id,
            userId: roomDB.animal.owner.id.toString(),
            msg: `${roomDB.animal.owner.firstname} refused receiving ${roomDB.animal.name}`,
            type: MessageType.refused
        };

        await this.messageGateway.sendMessage(null, msgRoom);
        // TODO: notifs
    }
}
