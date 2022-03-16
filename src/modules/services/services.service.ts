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

    async getById(id: number): Promise<Service> {
        return this.repository.findOneOrFail(id);
    }

    async activate(id: number) {
        const service = await this.getById(id);
        if (service.isActive) return service;
        service.isActive = true;
        return this.repository.save(service);
    }

    async deactivate(id: number) {
        const service = await this.getById(id);
        if (!service.isActive) return service;
        service.isActive = false;
        return this.repository.save(service);
    }
}
