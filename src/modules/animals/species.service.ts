/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entities/species.entity';

@Injectable()
export class SpeciesService {
    constructor(
        @InjectRepository(Species) private repository: Repository<Species>
    ) {}

    async getAll(): Promise<Species[]> {
        return await this.repository.find({ relations: [] });
    }

    async getById(id: number, populate = false): Promise<Species> {
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
