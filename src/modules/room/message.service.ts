/**
 * @author Maxime D'HARBOULLE
 * @create 2022-05-28
 */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { RoomGateway } from './room.gateway';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly repository: Repository<Message>,
        @Inject(forwardRef(() => RoomGateway))
        private readonly roomGateway: RoomGateway
    ) {}

    async create(message: Message) {
        return await this.repository.save(message);
    }

    async delete(id: number) {
        await this.repository.delete(id);
    }

    async get(roomId: number, offset = 0): Promise<Message[]> {
        const msgs = await this.repository.find({
            where: {
                room: {
                    id: roomId
                }
            },
            order: {
                id: 'DESC'
            },
            take: 15,
            skip: offset
        });
        return msgs.reverse();
    }

    async addSeenMessage(
        userIds: number[],
        messageIds: number[],
        roomCode: string
    ): Promise<Message[]> {
        const msgs = await this.repository.find({
            where: {
                id: In(messageIds)
            }
        });

        msgs.forEach((msg) => {
            msg.seen = Array.from(new Set([...msg.seen, ...userIds]));
            return msg;
        });

        this.roomGateway.sendSeenMessages(msgs, roomCode);

        return await this.repository.save(msgs);
    }
}
