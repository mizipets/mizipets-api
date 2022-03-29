/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-16
 */
import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
    constructor(
        @InjectRepository(Service) private readonly repository: Repository<Service>
    ) {}

    async getAll(): Promise<Service[]> {
        return this.repository.find();
    }

    async getAllActive(): Promise<Service[]> {
        return this.repository.find({ where: { isActive: true } });
    }

    async getById(id: number): Promise<Service> {
        const service: Service = await this.repository.findOne({ where: { id: id } });

        if (!service) throw new NotFoundException(`Service with id: ${id} not found`);
        return service;
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
