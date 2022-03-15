import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorites } from './favorites.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorites)
        private repository: Repository<Favorites>
    ) {}

    async getById(id: number): Promise<Favorites> {
        return this.repository.findOne({
            where: {
                id: id
            }
        });
    }

    async update(id: number, update: Favorites): Promise<Favorites> {
        const updateDB = await this.getById(id);
        updateDB.reference = update.disliked ?? updateDB.disliked;
        return await this.repository.save(updateDB);
    }
}
