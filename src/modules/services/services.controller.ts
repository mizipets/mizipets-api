/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-16
 */
import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param, Post,
    Put
} from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import {CreateServiceDto} from "./dto/create-service.dto";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {UpdateServiceDto} from "./dto/update-service.dto";

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async getAll(): Promise<Service[]> {
        return this.servicesService.getAll();
    }

    @Get('active')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    public async getAllActive(): Promise<Service[]> {
        return this.servicesService.getAllActive();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.ADMIN)
    public async create(@Body() serviceDto: CreateServiceDto): Promise<Service> {
        return this.servicesService.create(serviceDto);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async getById(@Param('id') id: number): Promise<Service> {
        return this.servicesService.getById(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async update(@Param('id') id: number, @Body() serviceDto: UpdateServiceDto): Promise<Service> {
        return this.servicesService.update(id, serviceDto);
    }

    @Put(':id/activate')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async activate(@Param('id') id: string): Promise<Service> {
        return this.servicesService.activate(parseInt(id));
    }

    @Put(':id/deactivate')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN)
    public async deactivate(@Param('id') id: string): Promise<Service> {
        return this.servicesService.deactivate(parseInt(id));
    }
}
