import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { AdvicesService } from './advices.service';
import { Advice } from './entities/advices.entity';
import { AdviceType } from './enums/advice-type.enum';

@Controller('advices')
export class AdvicesController {
    constructor(private advicesService: AdvicesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getAll() {
        return await this.advicesService.getAll();
    }

    @Get('random')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getRandom() {
        return await this.advicesService.getRandom();
    }

    @Get('specie/:id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getBySpecie(@Param('id') id: number) {
        const where: FindConditions<Advice> = {
            specie: {
                id: id
            },
            type: AdviceType.TEXT
        };
        return await this.advicesService.getBy(where);
    }

    @Get('type/:type')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getByType(@Param('type') type: AdviceType) {
        const where: FindConditions<Advice> = {
            type: type
        };
        return await this.advicesService.getOneBy(where);
    }
}
