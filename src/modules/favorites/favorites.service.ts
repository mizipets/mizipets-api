import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType } from '../services/enums/service-type.enum';
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

    async createFavoritesForUser(): Promise<Favorites[]> {
        const favorites = [
            {
                type: ServiceType.ADOPTION,
                reference: {
                    disliked: [],
                    liked: []
                }
            },
            {
                type: ServiceType.PETS,
                reference: { id: null }
            },
            {
                type: ServiceType.ADVICE,
                reference: { id: null }
            },
            {
                type: ServiceType.VETS,
                reference: { id: null }
            }
        ];

        return await this.repository.save(favorites);
    }

    async update(id: number, update: Favorites): Promise<Favorites> {
        const updateDB = await this.getById(id);

        // switch(updateDB.type) {
        //     case ServiceType.ADOPTION:
        //         updateDB.reference = update.reference ?? updateDB.reference;

        //         break;
        //     case ServiceType.PETS:
        //         updateDB.reference = update.disliked ?? updateDB.disliked;

        //         break;
        //     case ServiceType.ADVICE:
        //         updateDB.reference = update.disliked ?? updateDB.disliked;

        //         break;
        //     case ServiceType.VETS:
        // }
        updateDB.reference = update.reference ?? updateDB.reference;
        return await this.repository.save(updateDB);
    }
}
