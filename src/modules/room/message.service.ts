import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly repository: Repository<Message>
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
}
