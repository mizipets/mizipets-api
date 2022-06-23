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
import { FindConditions, In, Not, Repository } from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/entities/user.entity';
import { Message, MessageType } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { MsgToRoom, RoomGateway } from './room.gateway';
import { AnimalsService } from '../animals/animals.service';
import { FavoritesService } from '../favorites/favorites.service';
import { ServiceType } from '../services/enums/service-type.enum';
import { MessageService } from './message.service';
import { RoomStatus } from './enums/room-status.enum';

@Injectable()
export class RoomService {
    constructor(
        @Inject(forwardRef(() => RoomGateway))
        private messageGateway: RoomGateway,
        @Inject(forwardRef(() => AnimalsService))
        private animalsService: AnimalsService,
        private messageService: MessageService,
        @Inject(forwardRef(() => FavoritesService))
        private favoritesService: FavoritesService,
        @InjectRepository(Room) private readonly repository: Repository<Room>
    ) {}

    async create(user: User, animal: Animal): Promise<Room> {
        const room = new Room();
        room.status = RoomStatus.OPENED;
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

        return await this.getBy({ id: roomDB.id });
    }

    async findByUserAndAnimal(user: User, animal: Animal): Promise<Room> {
        const room = await this.repository.findOne({
            where: {
                animal: {
                    id: animal.id
                },
                adoptant: {
                    id: user.id
                },
                status: Not(RoomStatus.ARCHIVED)
            },
            relations: ['adoptant', 'animal', 'animal.owner', 'animal.race']
        });
        if (room) {
            room.messages = await this.messageService.get(room.id);
            room.adoptant.removeSensitiveData();
            room.animal.owner.removeSensitiveData();
        }
        return room;
    }

    async getBy(where: FindConditions<Room>): Promise<Room> {
        where.status = Not(RoomStatus.ARCHIVED);
        const room: Room = await this.repository.findOne({
            where: where,
            relations: ['adoptant', 'animal', 'animal.owner', 'animal.race']
        });
        if (!room) throw new NotFoundException(`Room with not found`);
        room.messages = await this.messageService.get(room.id);
        room.adoptant.removeSensitiveData();
        room.animal.owner.removeSensitiveData();
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
                    },
                    status: Not(RoomStatus.ARCHIVED)
                },
                {
                    adoptant: {
                        id: id
                    },
                    status: Not(RoomStatus.ARCHIVED)
                }
            ],
            relations: ['adoptant', 'animal', 'animal.owner', 'animal.race']
        });

        return Promise.all(
            rooms.map(async (room) => {
                room.messages = await this.messageService.get(room.id);
                room.adoptant.removeSensitiveData();
                room.animal.owner.removeSensitiveData();
                return room;
            })
        );
    }

    async requestGive(roomId: number) {
        const roomDB = await this.getBy({ id: roomId });
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

    async acceptRequestGive(roomId: number, messageId: number) {
        await this.messageService.delete(messageId);

        const roomDB = await this.getBy({ id: roomId });

        roomDB.requestGive = false;

        const animal = roomDB.animal;

        animal.isAdoption = false;
        animal.lastOwner = animal.owner;
        animal.owner = roomDB.adoptant;
        roomDB.adoptant = animal.lastOwner;

        this.favoritesService.removeFavorite(
            animal.owner.id,
            ServiceType.ADOPTION,
            animal.id
        );

        roomDB.status = RoomStatus.GIVED;
        roomDB.animal = await this.animalsService.save(animal);

        await this.repository.save(roomDB);

        const msgRoom: MsgToRoom = {
            roomCode: roomDB.code,
            roomId: roomDB.id,
            userId: roomDB.animal.owner.id.toString(),
            msg: `accepted receiving ${roomDB.animal.name}`,
            type: MessageType.accepted
        };
        await this.messageGateway.sendMessage(null, msgRoom);

        await this.closeAllWithAnimalExcept(roomDB);
    }

    async closeAllWithAnimalExcept(room: Room): Promise<void> {
        const roomsToClose = await this.repository.find({
            where: {
                id: Not(room.id),
                animal: {
                    id: room.animal.id
                },
                status: Not(In([RoomStatus.CLOSED, RoomStatus.ARCHIVED]))
            },
            relations: ['animal', 'animal.owner', 'adoptant']
        });
        await Promise.all(
            roomsToClose.map(async (roomToClose) => {
                await this.close(roomToClose);
            })
        );
    }

    async closeAllWithAnimal(animalId: number): Promise<void> {
        const roomsToClose = await this.repository.find({
            where: {
                animal: {
                    id: animalId
                },
                status: Not(In([RoomStatus.CLOSED, RoomStatus.ARCHIVED]))
            },
            relations: ['animal', 'animal.owner', 'adoptant']
        });
        await Promise.all(
            roomsToClose.map(async (roomToClose) => {
                await this.close(roomToClose);
            })
        );
    }

    async close(room: Room): Promise<void> {
        const msgRoom: MsgToRoom = {
            roomCode: room.code,
            roomId: room.id,
            userId: room.animal.owner.id.toString(),
            msg: `Room closed`,
            type: MessageType.close
        };
        await this.messageGateway.sendMessage(null, msgRoom);

        await this.repository.update(
            {
                id: room.id
            },
            {
                status: RoomStatus.CLOSED
            }
        );

        await this.favoritesService.dislike(room.adoptant.id, room.animal.id);
        await this.favoritesService.dislike(
            room.animal.owner.id,
            room.animal.id
        );
    }

    async archive(room: Room): Promise<void> {
        await this.repository.update(room.id, {
            status: RoomStatus.ARCHIVED
        });
    }

    async refuseRequestGive(roomId: number, messageId: number) {
        await this.messageService.delete(messageId);
        const roomDB = await this.getBy({ id: roomId });

        roomDB.requestGive = false;

        await this.repository.save(roomDB);

        const msgRoom: MsgToRoom = {
            roomCode: roomDB.code,
            roomId: roomDB.id,
            userId: roomDB.adoptant.id.toString(),
            msg: `${roomDB.adoptant.firstname} refused receiving ${roomDB.animal.name}`,
            type: MessageType.refused
        };
        await this.messageGateway.sendMessage(null, msgRoom);
    }
}
