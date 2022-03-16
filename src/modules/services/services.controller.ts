/**
 * @author Maxime d'Harboullé
 * @email maxime.dharboulle@gmail.com
 * @create date 2022-03-16 00:35:16
 * @modify date 2022-03-16 00:35:16
 * @desc [description]
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
    constructor(private servicesService: ServicesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAll() {
        return await this.servicesService.getAll();
    }

    @Put(':id/activate')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async activate(@Param('id') id: string) {
        return await this.servicesService.activate(parseInt(id));
    }

    @Put(':id/deactivate')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async deactivate(@Param('id') id: string) {
        return await this.servicesService.deactivate(parseInt(id));
    }
}
