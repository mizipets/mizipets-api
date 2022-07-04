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
import { SpeciesService } from './species.service';
import { UsersService } from '../../users/users.service';
import { SpecieDTO } from './specie.dto';

@Controller('species')
export class SpeciesController {
    constructor(
        private speciesService: SpeciesService,
        private usersService: UsersService
    ) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAll(@Req() req): Promise<SpecieDTO[]> {
        const user = await this.usersService.getById(req.user.id);
        return (await this.speciesService.getAll()).map(
            (specie) => new SpecieDTO(specie, user.preferences.lang)
        );
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getById(@Req() req, @Param('id') id: string): Promise<SpecieDTO> {
        const user = await this.usersService.getById(req.user.id);
        const specie = await this.speciesService.getById(parseInt(id), true);
        return new SpecieDTO(specie, user.preferences.lang);
    }
}
