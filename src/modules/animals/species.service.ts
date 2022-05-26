/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specie } from './entities/specie.entity';

@Injectable()
export class SpeciesService {
    constructor(
        @InjectRepository(Specie) private repository: Repository<Specie>
    ) {}

    async getAll(): Promise<Specie[]> {
        return await this.repository.find({ relations: [] });
    }

    async getById(id: number, populate = false): Promise<Specie> {
        const db = await this.repository.findOne(id, {
            relations: populate ? ['races'] : []
        });
        if (!db) {
            throw new NotFoundException(`No specie with id: ${id}`);
        } else {
            return db;
        }
    }
}
