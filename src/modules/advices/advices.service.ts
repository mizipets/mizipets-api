import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { Advice } from './entities/advices.entity';

@Injectable()
export class AdvicesService {
    constructor(
        @InjectRepository(Advice)
        private readonly repository: Repository<Advice>
    ) {}

    async getAll() {
        return await this.repository.find();
    }

    async getById(id: number) {
        return await this.repository.findOne({
            where: {
                id: id
            }
        });
    }

    async getBy(where: FindConditions<Advice>) {
        return await this.repository.find({
            where: where
        });
    }
}
