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
import { Message, MessageType } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { MsgToRoom, RoomGateway } from './room.gateway';
import { AnimalsService } from '../animals/animals.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ServiceType } from '../services/enums/service-type.enum';
import { MessageService } from './message.service';

@Injectable()
export class RoomService {
    constructor(
        @Inject(forwardRef(() => RoomGateway))
        private messageGateway: RoomGateway,
        private animalsService: AnimalsService,
        private messageService: MessageService,
        private favoritesService: FavoritesService,
        @InjectRepository(Room) private readonly repository: Repository<Room>
    ) {}

    async create(user: User, animal: Animal): Promise<Room> {
        const room = new Room();
        room.closed = false;
        room.requestGive = false;
        room.adoptant = user;
        room.animal = animal;
        room.messages = [];
        room.code = room.getCode();

        const roomDB = await this.repository.save(room);

        const message = new Message();
        message.type = MessageType.init;
        message.room = roomDB;
        message.created = new Date();
        message.writer = user.id;
        message.text = 'Conversation start';

        await this.messageService.create(message);

        return await this.getById(roomDB.id);
    }

    async findByUserAndAnimal(user: User, animal: Animal): Promise<Room> {
        const room = await this.repository.findOne({
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
        if (room) {
            room.messages = await this.messageService.get(room.id);
        }
        return room;
    }

    async getById(id: number): Promise<Room> {
        const room: Room = await this.repository.findOne({
            where: { id },
            relations: ['adoptant', 'animal', 'animal.owner', 'animal.race']
        });
        if (!room) throw new NotFoundException(`Room with id: ${id} not found`);
        room.messages = await this.messageService.get(room.id);
        return room;
    }

    async writeMessage(
        roomId: number,
        text: string,
        userId: number,
        type: MessageType = MessageType.text
    ): Promise<Message> {
        const message = new Message();
        message.created = new Date();
        message.text = text;
        message.writer = userId;
        message.type = type;
        message.room = new Room();
        message.room.id = roomId;

        return await this.messageService.create(message);
    }

    async findByUserId(id: number): Promise<Room[]> {
        const rooms = await this.repository.find({
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
        return Promise.all(
            rooms.map(async (room) => {
                room.messages = await this.messageService.get(room.id);
                return room;
            })
        );
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

    async acceptRequestGive(roomId: number, messageId: number, user: User) {
        await this.messageService.delete(messageId);
        const roomDB = await this.getById(roomId);

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

    async refuseRequestGive(roomId: number, messageId: number, user: User) {
        await this.messageService.delete(messageId);
        const roomDB = await this.getById(roomId);

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
