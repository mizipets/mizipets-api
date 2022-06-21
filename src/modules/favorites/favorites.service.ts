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
import { UsersService } from '../users/users.service';
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
        private animalsService: AnimalsService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
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
                type: ServiceType.ADVICES,
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
                                ['race', 'race.specie', 'owner']
                            );
                        populate.reference = referencePopulated;
                        break;
                    case ServiceType.ADVICES:
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

    async removeFromAllUser(referenceId: number, type: ServiceType) {
        const userIds = await this.usersService.getIdOfAllUsers();

        const removeIdActions = userIds.map((userId) =>
            this.removeFavorite(userId, type, referenceId)
        );

        return Promise.all(removeIdActions);
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
            case ServiceType.ADVICES:
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

    async like(userId: number, referenceId: number): Promise<Favorites> {
        const favorite = await this.getByUserIdAndType(
            userId,
            ServiceType.ADOPTION
        );
        const reference = favorite.reference as AdoptionReferences;
        reference.liked.push(referenceId);
        reference.disliked = reference.disliked.filter(
            (id) => id !== referenceId
        );

        favorite.reference = reference;

        return await this.repository.save(favorite);
    }

    async dislike(userId: number, referenceId: number): Promise<Favorites> {
        const favorite = await this.getByUserIdAndType(
            userId,
            ServiceType.ADOPTION
        );
        const reference = favorite.reference as AdoptionReferences;
        reference.liked = reference.disliked.filter((id) => id !== referenceId);
        reference.disliked.push(referenceId);

        favorite.reference = reference;

        return await this.repository.save(favorite);
    }
}
