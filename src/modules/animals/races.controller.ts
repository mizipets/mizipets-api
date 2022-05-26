/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { RacesService } from './races.service';
import { Race } from './entities/race.entity';

@Controller('races')
export class RacesController {
    constructor(private racesService: RacesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAll(): Promise<Race[]> {
        return this.racesService.getAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(@Param('id') id: string): Promise<Race> {
        return this.racesService.getById(parseInt(id));
    }
}
