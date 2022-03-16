/**
 * @author Maxime d'Harboullé
 * @email maxime.dharboulle@gmail.com
 * @create date 2022-03-16 00:35:23
 * @modify date 2022-03-16 00:35:23
 * @desc [description]
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service) private repository: Repository<Service>
    ) {}

    async getAll(): Promise<Service[]> {
        return this.repository.find();
    }
}
