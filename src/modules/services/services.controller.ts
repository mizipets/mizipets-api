/**
 * @author Maxime D'HARBOULLE & Julien DA CORTE
 * @create 2022-03-16
 */
import {
    Body,
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
import { Service } from './entities/service.entity';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Services')
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Get()
    @ApiOkResponse({
        description: 'All services retrieved',
        type: [Service]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async getAll(): Promise<Service[]> {
        return this.servicesService.getAll();
    }

    @Get('active')
    @ApiOkResponse({
        description: 'All active services retrieved',
        type: [Service]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    public async getAllActive(): Promise<Service[]> {
        return this.servicesService.getAllActive();
    }

    @Get(':id')
    @ApiOkResponse({
        description: 'Service retrieved',
        type: Service
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async getById(@Param('id') id: number): Promise<Service> {
        return this.servicesService.getById(id);
    }

    @Put(':id')
    @ApiOkResponse({
        description: 'Service updated',
        type: Service
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async update(
        @Param('id') id: number,
        @Body() serviceDto: UpdateServiceDto
    ): Promise<Service> {
        return this.servicesService.update(id, serviceDto);
    }

    @Put(':id/activate')
    @ApiOkResponse({
        description: 'Service activated',
        type: Service
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async activate(@Param('id') id: string): Promise<Service> {
        return this.servicesService.activate(parseInt(id));
    }

    @Put(':id/deactivate')
    @ApiOkResponse({
        description: 'Service deactivated',
        type: Service
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async deactivate(@Param('id') id: string): Promise<Service> {
        return this.servicesService.deactivate(parseInt(id));
    }
}
