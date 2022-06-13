/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Roles } from '../../authentication/enum/roles.emum';
import { OnlyRoles } from '../../authentication/guards/role.decorator';
import { SpeciesService } from './species.service';
import { Specie } from '../entities/specie.entity';

@Controller('species')
export class SpeciesController {
    constructor(private speciesService: SpeciesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAll(): Promise<Specie[]> {
        return this.speciesService.getAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(@Param('id') id: string): Promise<Specie> {
        return this.speciesService.getById(parseInt(id), true);
    }
}
