/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-25
 */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, In, Repository } from 'typeorm';
import { FavoritesService } from '../favorites/favorites.service';
import { Advice } from './entities/advices.entity';

@Injectable()
export class AdvicesService {
    constructor(
        @InjectRepository(Advice)
        private readonly repository: Repository<Advice>,
        @Inject(forwardRef(() => FavoritesService))
        private favoritesService: FavoritesService
    ) {}

    async getAll(): Promise<Advice[]> {
        return await this.repository.find();
    }

    async getRandom(): Promise<Advice[]> {
        return await this.repository
            .createQueryBuilder()
            .orderBy('RANDOM()')
            .limit(20)
            .getMany();
    }

    async getById(id: number): Promise<Advice> {
        return await this.repository.findOne({
            where: {
                id: id
            }
        });
    }

    async getBy(where: FindConditions<Advice>): Promise<Advice[]> {
        return await this.repository.find({
            where: where
        });
    }

    async getOneBy(where: FindConditions<Advice>): Promise<Advice> {
        return await this.repository.findOne({
            where: where
        });
    }

    async getByIds(ids: number[]): Promise<Advice[]> {
        return await this.repository.find({
            where: {
                id: In(ids)
            }
        });
    }
}
