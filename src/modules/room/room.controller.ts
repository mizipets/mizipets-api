/**
 * @author Maxime D'HARBOULLE
 * @create 2022-05-28
 */
import {
    Body,
    Controller,
    Delete,
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
import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags
} from '@nestjs/swagger';
import { AnimalsService } from '../animals/animals.service';
import { Roles } from '../authentication/enum/roles.emum';
import { OnlyRoles } from '../authentication/guards/role.decorator';
import { UsersService } from '../users/users.service';
import { Message } from './entities/message.entity';
import { Room } from './entities/room.entity';
import { MessageService } from './message.service';
import { RoomService } from './room.service';
@ApiTags('Room')
@Controller('room')
export class RoomController {
    constructor(
        private roomService: RoomService,
        private messageService: MessageService,
        private usersService: UsersService,
        private animalsService: AnimalsService
    ) {}

    @Post(':animalId')
    @ApiCreatedResponse({
        description: 'Room created',
        type: Room
    })
    @ApiNotFoundResponse({
        description: 'Missing user or animal'
    })
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
    @ApiCreatedResponse({
        description: 'Room retrieved',
        type: Room
    })
    @ApiNotFoundResponse({
        description: "Room doesn't exist or missing user or animal"
    })
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
    @ApiOkResponse({
        description: 'Rooms retrieved',
        type: [Room]
    })
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
    @ApiOkResponse({
        description: 'Room retrieved or created',
        type: Room
    })
    @ApiNotFoundResponse({
        description: "Room doesn't exist or missing user or animal"
    })
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
                : await this.roomService.getBy({
                      id: parseInt(roomId)
                  });
        if (roomDB) {
            const seenMessages = await this.messageService.addSeenMessage(
                [req.user.id],
                roomDB.messages.map((msg) => msg.id),
                roomDB.code
            );
            roomDB.messages.forEach((msg) => {
                const seenMsg = seenMessages.find((seen) => seen.id === msg.id);
                if (seenMsg) msg = seenMsg;
            });
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
    @ApiOkResponse({
        description: 'Request sent'
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async requestGive(
        @Req() req,
        @Param('roomId') roomId: string
    ): Promise<void> {
        await this.roomService.requestGive(parseInt(roomId));
    }

    @Put(':roomId/acceptRequestGive')
    @ApiOkResponse({
        description: 'Request accepted'
    })
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
    @ApiOkResponse({
        description: 'Request refused'
    })
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

    @Put(':roomId/close')
    @ApiOkResponse({
        description: 'Room closed'
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async close(@Param('roomId') roomId: string): Promise<void> {
        const room = await this.roomService.getBy({ id: parseInt(roomId) });
        await this.roomService.close(room);
    }

    @Delete(':roomId')
    @ApiOkResponse({
        description: 'Room archived'
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async delete(@Param('roomId') roomId: string): Promise<void> {
        const room = await this.roomService.getBy({ id: parseInt(roomId) });
        await this.roomService.archive(room);
    }

    @Get(':roomId/messages')
    @ApiOkResponse({
        description: 'Room messages',
        type: [Message]
    })
    @HttpCode(HttpStatus.OK)
    @OnlyRoles(Roles.PRO, Roles.STANDARD)
    async messages(
        @Req() req,
        @Param('roomId') roomId: number,
        @Query('offset') offset: number
    ): Promise<Message[]> {
        const room = await this.roomService.getBy({ id: roomId });
        const messages = await this.messageService.get(room.id, offset);
        return await this.messageService.addSeenMessage(
            [req.user.id],
            messages.map((msg) => msg.id),
            room.code
        );
    }
}
