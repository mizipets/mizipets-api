/**
 * @author Latif SAGNA
 * @create 2022-03-11
 */
import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { DeviceService } from './device.service';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { Roles } from '../authentication/enum/roles.emum';
import { Device } from './entities/device.entity';

@Controller('devices')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.ADMIN, Roles.STANDARD)
    async getAll() {
        return await this.deviceService.getAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getByUserId(@Param('id') id: number): Promise<Device[]> {
        return await this.deviceService.getByUserID(id);
    }
}
