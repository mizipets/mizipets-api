/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-25
 */
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Req
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindConditions } from 'typeorm';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { UsersService } from '../users/users.service';
import { AdvicesService } from './advices.service';
import { AdviceLang } from './dto/advice-lang.dto';
import { Advice } from './entities/advices.entity';
import { AdviceType } from './enums/advice-type.enum';

@ApiTags('Advices')
@Controller('advices')
export class AdvicesController {
    constructor(
        private advicesService: AdvicesService,
        private readonly usersService: UsersService
    ) {}

    @Get()
    @ApiOkResponse({
        description: 'Advices retrieved',
        type: [AdviceLang]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAll(@Req() req): Promise<AdviceLang[]> {
        const user = await this.usersService.getById(req.user.id);
        return (await this.advicesService.getAll()).map(
            (advice) => new AdviceLang(advice, user.preferences.lang)
        );
    }

    @Get('random')
    @ApiOkResponse({
        description: 'Random advices retrieved',
        type: [AdviceLang]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getRandom(@Req() req): Promise<AdviceLang[]> {
        const user = await this.usersService.getById(req.user.id);
        const advices = await this.advicesService.getRandom();
        return advices.map(
            (advice) => new AdviceLang(advice, user.preferences.lang)
        );
    }

    @Get('specie/:id')
    @ApiOkResponse({
        description: 'Advices retrieved upon condition',
        type: [AdviceLang]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getBySpecie(
        @Req() req,
        @Param('id') id: number
    ): Promise<AdviceLang[]> {
        const user = await this.usersService.getById(req.user.id);
        const where: FindConditions<Advice> = {
            specie: {
                id: id
            },
            type: AdviceType.TEXT
        };
        return (await this.advicesService.getBy(where)).map(
            (advice) => new AdviceLang(advice, user.preferences.lang)
        );
    }

    @Get('type/:type')
    @ApiOkResponse({
        description: 'Advice retrieved',
        type: AdviceLang
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getByType(
        @Req() req,
        @Param('type') type: AdviceType
    ): Promise<AdviceLang> {
        const user = await this.usersService.getById(req.user.id);
        const where: FindConditions<Advice> = {
            type: type
        };
        const advice = await this.advicesService.getOneBy(where);
        return new AdviceLang(advice, user.preferences.lang);
    }
}
