/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Req
} from '@nestjs/common';
import { Roles } from '../../authentication/enum/roles.emum';
import { OnlyRoles } from '../../authentication/guards/role.decorator';
import { RacesService } from './races.service';
import { RaceDTO } from './race.dto';
import { UsersService } from '../../users/users.service';

@Controller('races')
export class RacesController {
    constructor(
        private racesService: RacesService,
        private usersService: UsersService
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAll(@Req() req): Promise<RaceDTO[]> {
        const user = await this.usersService.getById(req.user.id);
        return (await this.racesService.getAll()).map(
            (race) => new RaceDTO(race, user.preferences.lang)
        );
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(@Req() req, @Param('id') id: string): Promise<RaceDTO> {
        const user = await this.usersService.getById(req.user.id);
        const race = await this.racesService.getById(parseInt(id));
        return new RaceDTO(race, user.preferences.lang);
    }
}
