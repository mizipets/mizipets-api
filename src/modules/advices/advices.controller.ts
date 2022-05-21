import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { AdvicesService } from './advices.service';
import { Advice } from './entities/advices.entity';

@Controller('advices')
export class AdvicesController {
    constructor(private advicesService: AdvicesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getAll() {
        return await this.advicesService.getAll();
    }

    @Get('specie/:id')
    @HttpCode(HttpStatus.OK)
    async getBySpecie(@Param('id') id: number) {
        const where: FindConditions<Advice> = {
            specie: {
                id: id
            }
        };
        return await this.advicesService.getBy(where);
    }
}
