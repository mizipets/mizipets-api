import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req
} from '@nestjs/common';
import { AnimalsService } from '../animals/animals.service';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { UsersService } from '../users/users.service';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { MessageService } from './message.service';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(
        private roomService: RoomService,
        private messageService: MessageService,
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
        if (!user) {
            throw new NotFoundException('Missing user');
        }
        if (!animal) {
            throw new NotFoundException('Missing animal');
        }
        return await this.roomService.create(user, animal);
    }

    @Get(':animalId')
    @HttpCode(HttpStatus.CREATED)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getRoom(
        @Req() req,
        @Param('animalId') animalId: string
    ): Promise<Room> {
        const user = await this.usersService.getById(req.user.id);
        const animal = await this.animalsService.getById(parseInt(animalId));
        if (!user) {
            throw new NotFoundException('Missing user');
        }
        if (!animal) {
            throw new NotFoundException('Missing animal');
        }
        const room = await this.roomService.findByUserAndAnimal(user, animal);
        if (!room) {
            throw new NotFoundException(
                "Room with you and this animal doesn't exist"
            );
        }
        return room;
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getRooms(
        @Req() req,
        @Query('userId') userId: string
    ): Promise<Room[]> {
        return await (
            await this.roomService.findByUserId(parseInt(userId))
        ).sort((a, b) => {
            if (a.getLastMessageDate() < b.getLastMessageDate()) return 1;
            if (a.getLastMessageDate() > b.getLastMessageDate()) return -1;
            return 0;
        });
    }

    @Get(':roomId/:animalId/orCreate')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD, Roles.ADMIN)
    async getOrCreateRoom(
        @Req() req,
        @Param('roomId') roomId: string,
        @Param('animalId') animalId: string
    ): Promise<Room> {
        const roomDB =
            roomId === 'null'
                ? null
                : await this.roomService.getById(parseInt(roomId));
        if (roomDB) {
            return roomDB;
        } else {
            const user = await this.usersService.getById(req.user.id);
            const animal = await this.animalsService.getById(
                parseInt(animalId)
            );
            if (!user) {
                throw new NotFoundException('Missing user');
            }
            if (!animal) {
                throw new NotFoundException('Missing animal');
            }
            let room = await this.roomService.findByUserAndAnimal(user, animal);
            if (!room) {
                room = await this.roomService.create(user, animal);
            }
            return room;
        }
    }

    @Put(':roomId/requestGive')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async requestGive(
        @Req() req,
        @Param('roomId') roomId: string
    ): Promise<void> {
        await this.roomService.requestGive(parseInt(roomId));
    }

    @Put(':roomId/acceptRequestGive')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async acceptRequestGive(
        @Req() req,
        @Param('roomId') roomId: string,
        @Body() body: { messageId: number }
    ): Promise<void> {
        await this.roomService.acceptRequestGive(
            parseInt(roomId),
            body.messageId
        );
    }

    @Put(':roomId/refuseRequestGive')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async refuseRequestGive(
        @Req() req,
        @Param('roomId') roomId: string,
        @Body() body: { messageId: number }
    ): Promise<void> {
        await this.roomService.refuseRequestGive(
            parseInt(roomId),
            body.messageId
        );
    }

    @Get(':roomId/messages')
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async messages(
        @Req() req,
        @Param('roomId') roomId: number,
        @Query('offset') offset: number
    ): Promise<Message[]> {
        return await this.messageService.get(roomId, offset);
    }
}
