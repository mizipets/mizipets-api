/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-25
 */
import {
    forwardRef,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnimalsService } from '../animals/animals.service';
import { ServiceType } from '../services/enums/service-type.enum';
import {
    Favorites,
    Reference,
    AdoptionReferences,
    AdviceReferences,
    VetsReferences
} from './entities/favorites.entity';
import {
    AdoptionReferencesPopulated,
    FavoritesPopulated
} from './entities/favorites.populated';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorites)
        private readonly repository: Repository<Favorites>,
        @Inject(forwardRef(() => AnimalsService))
        private animalsService: AnimalsService
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
        return await this.repository.find({ user: { id: userId } });
    }

    async getPopulatedFavoritesOfUser(userId: number) {
        const favorites = await this.repository.find({ user: { id: userId } });
        const promises = Promise.all(
            favorites.map(async (favorite) => {
                const populate = new FavoritesPopulated();
                populate.id = favorite.id;
                populate.type = favorite.type;
                switch (favorite.type) {
                    case ServiceType.ADOPTION:
                        const reference =
                            favorite.reference as AdoptionReferences;
                        const referencePopulated =
                            favorite.reference as AdoptionReferencesPopulated;
                        referencePopulated.disliked =
                            await this.animalsService.getByIds(
                                reference.disliked,
                                ['race', 'race.specie']
                            );
                        referencePopulated.liked =
                            await this.animalsService.getByIds(
                                reference.liked,
                                ['race', 'race.specie']
                            );
                        populate.reference = referencePopulated;
                        break;
                    case ServiceType.ADVICE:
                        break;
                    case ServiceType.VETS:
                        break;
                    case ServiceType.PETS:
                        break;
                }
                return populate;
            })
        );
        return await promises;
    }

    async removeFavorite(
        userId: number,
        type: ServiceType,
        referenceId: number
    ): Promise<Favorites> {
        const favorite = await this.getByUserIdAndType(userId, type);
        let reference: Reference;

        switch (favorite.type) {
            case ServiceType.ADOPTION:
                reference = favorite.reference as AdoptionReferences;
                reference.disliked = (reference.disliked as number[]).filter(
                    (id) => id !== referenceId
                ) as number[];
                reference.liked = (reference.liked as number[]).filter(
                    (id) => id !== referenceId
                );
                break;
            case ServiceType.ADVICE:
                reference = favorite.reference as AdviceReferences;
                reference.id = null;
                break;
            case ServiceType.VETS:
                reference = favorite.reference as VetsReferences;
                reference.id = null;
                break;
        }

        favorite.reference = reference;

        return await this.repository.save(favorite);
    }
}
