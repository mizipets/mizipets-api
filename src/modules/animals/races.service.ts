/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Race } from './entities/race.entity';

@Injectable()
export class RacesService {
    constructor(@InjectRepository(Race) private repository: Repository<Race>) {}

    async getAll(): Promise<Race[]> {
        return await this.repository.find({ relations: [] });
    }

    async getById(id: number): Promise<Race> {
        const db = await this.repository.findOne(id, {
            relations: []
        });
        if (!db) {
            throw new NotFoundException(`No race with id: ${id}`);
        } else {
            return db;
        }
    }
}
