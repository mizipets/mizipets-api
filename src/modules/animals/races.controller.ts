import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { RacesService } from './races.service';

@Controller('races')
export class RacesController {
    constructor(private racesService: RacesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async getAll() {
        return this.racesService.getAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async getById(@Param('id') id: number) {
        return this.racesService.getById(id);
    }
}
