/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-25
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType } from '../services/enums/service-type.enum';
import {
    AdoptionReferences,
    AdviceReferences,
    Favorites,
    PetsReferences,
    VetsReferences
} from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorites)
        private readonly repository: Repository<Favorites>
    ) {}

    async getById(id: number): Promise<Favorites> {
        const favorite: Favorites = await this.repository.findOne({
            where: { id: id }
        });

        if (!favorite)
            throw new NotFoundException(`Favorite with id: ${id} not found`);
        return favorite;
    }

    async getByUserIdAndType(
        userId: number,
        type: ServiceType
    ): Promise<Favorites> {
        return this.repository.findOneOrFail({
            user: { id: userId },
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

        return this.repository.save(favorites);
    }

    async update(id: number, update: Favorites): Promise<Favorites> {
        const updateDB = await this.getById(id);
        updateDB.reference = update.reference ?? updateDB.reference;

        return this.repository.save(updateDB);
    }

    async getFavoritesOfUser(userId: number): Promise<Favorites[]> {
        return this.repository.find({ user: { id: userId } });
    }

    async removeFavorite(
        userId: number,
        type: ServiceType,
        referenceId: number
    ): Promise<Favorites> {
        const favorite = await this.getByUserIdAndType(userId, type);
        if (favorite.reference instanceof AdoptionReferences) {
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
