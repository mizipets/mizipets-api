import {
    Controller,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Req
} from '@nestjs/common';
import { AnimalsService } from '../animals/animals.service';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { UsersService } from '../users/users.service';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(
        private roomService: RoomService,
        private usersService: UsersService,
        private animalsService: AnimalsService
    ) {}

    @Post(':animalId')
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async createRoom(
        @Req() req,
        @Param('animalId') animalId: string
    ): Promise<Room> {
        const user = await this.usersService.getById(req.user.id);
        const animal = await this.animalsService.getById(parseInt(animalId));
        return await this.roomService.create(user, animal);
    }
}
