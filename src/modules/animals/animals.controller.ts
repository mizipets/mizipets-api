import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req
} from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { AnimalsService } from './animals.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';

@Controller('animals')
export class AnimalsController {
    constructor(private animalsService: AnimalsService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async create(@Req() req, @Body() dto: CreateAnimalDTO) {
        return this.animalsService.create(dto, req.user);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async getAll() {
        return this.animalsService.getAll();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async getById(@Param('id') id: number) {
        return this.animalsService.getById(id);
    }
}
