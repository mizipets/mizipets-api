import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from './entity/species.entity';

@Injectable()
export class SpeciesService {
    constructor(
        @InjectRepository(Species) private repository: Repository<Species>
    ) {}

    async getAll(): Promise<Species[]> {
        return await this.repository.find({ relations: [] });
    }

    async getById(id: number): Promise<Species> {
        const db = await this.repository.findOne(id, {
            relations: []
        });
        if (!db) {
            throw new NotFoundException(`No specie with id: ${id}`);
        } else {
            return db;
        }
    }
}
