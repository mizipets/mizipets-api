import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Req
} from '@nestjs/common';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { AnimalsService } from './animals.service';
import { CreateAnimalDTO } from './dto/create-animal.dto';
import { UpdateAnimalDTO } from './dto/update-animal.dto';

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

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async update(
        @Req() req,
        @Param('id') id: number,
        @Body() dto: UpdateAnimalDTO
    ) {
        const animal = await this.animalsService.getById(id);

        if (req.user.id !== animal.owner.id) {
            throw new ForbiddenException(
                "Can't update the animal of someone else!"
            );
        }
        return await this.animalsService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async delete(@Req() req, @Param('id') id: number) {
        const animal = await this.animalsService.getById(id);
        if (req.user.id !== animal.owner.id) {
            throw new ForbiddenException(
                "Can't delete the animal of someone else!"
            );
        }
        await this.animalsService.delete(id);
    }
}
