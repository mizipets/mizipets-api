import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType } from '../services/enums/service-type.enum';
import {
    AdoptionReferences,
    AdviceReferences,
    Favorites,
    PetsReferences,
    VetsReferences
} from './favorites.entity';

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

    async getByUserIdAndType(
        userId: number,
        type: ServiceType
    ): Promise<Favorites> {
        return this.repository.findOneOrFail({
            user: {
                id: userId
            },
            type: type
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
        updateDB.reference = update.reference ?? updateDB.reference;
        return await this.repository.save(updateDB);
    }

    async getFavoritesOfUser(userId: number): Promise<Favorites[]> {
        return this.repository.find({
            user: {
                id: userId
            }
        });
    }

    async removeFavorite(
        userId: number,
        type: ServiceType,
        referenceId: number
    ): Promise<Favorites> {
        const favorite = await this.getByUserIdAndType(userId, type);
        console.log(favorite.reference);
        console.log(referenceId);

        console.log(favorite.reference instanceof AdoptionReferences);

        if (favorite.reference instanceof AdoptionReferences) {
            console.log('here');

            favorite.reference.disliked = favorite.reference.disliked.filter(
                (id) => id !== referenceId
            );
            favorite.reference.liked = favorite.reference.liked.filter(
                (id) => id !== referenceId
            );
        } else if (favorite.reference instanceof PetsReferences) {
            favorite.reference.id = null;
        } else if (favorite.reference instanceof AdviceReferences) {
            favorite.reference.id = null;
        } else if (favorite.reference instanceof VetsReferences) {
            favorite.reference.id = null;
        }

        return await this.repository.save(favorite);
    }
}
