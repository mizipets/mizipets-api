/**
 * @author Maxime d'Harboullé
 * @email maxime.dharboulle@gmail.com
 * @create date 2022-03-16 00:35:16
 * @modify date 2022-03-16 00:35:16
 * @desc [description]
 */
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
    constructor(private servicesService: ServicesService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    public async getAll() {
        return await this.servicesService.getAll();
    }
}
