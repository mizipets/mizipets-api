import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { skip } from 'rxjs';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly repository: Repository<Message>
    ) {}

    async create(message: Message) {
        return this.repository.save(message);
    }

    async delete(id: number) {
        await this.repository.delete(id);
    }

    async get(roomId: number): Promise<Message[]> {
        return await this.repository.find({
            where: {
                room: {
                    id: roomId
                }
            },
            take: 10,
            skip: 0
        });
    }
}
