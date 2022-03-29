/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-16
 */
import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Put
} from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async getAll() {
        return this.servicesService.getAll();
    }

    @Get('active')
    @HttpCode(HttpStatus.OK)
    public async getAllActive() {
        return this.servicesService.getAllActive();
    }

    @Put(':id/activate')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async activate(@Param('id') id: string) {
        return this.servicesService.activate(parseInt(id));
    }

    @Put(':id/deactivate')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async deactivate(@Param('id') id: string) {
        return this.servicesService.deactivate(parseInt(id));
    }
}
