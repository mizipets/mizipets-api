/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Roles } from '../../authentication/enum/roles.emum';
import { OnlyRoles } from '../../authentication/guards/role.decorator';
import { SpeciesService } from './species.service';
import { Specie } from '../entities/specie.entity';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
@ApiTags('Species')
@Controller('species')
export class SpeciesController {
    constructor(private speciesService: SpeciesService) {}

    @Get()
    @ApiOkResponse({
        description: 'Species retrieved',
        type: [Specie]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAll(): Promise<Specie[]> {
        return this.speciesService.getAll();
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Specie retrieved',
        type: Specie
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(@Param('id') id: string): Promise<Specie> {
        return this.speciesService.getById(parseInt(id), true);
    }
}
