/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from '../notifications/notifications.service';
import { ServiceType } from '../services/enums/service-type.enum';
import { MessageType } from './entities/message.entity';
import { RoomService } from './room.service';

const { MESSAGE_PORT } = process.env;

@WebSocketGateway(parseInt(MESSAGE_PORT), {
    cors: {
        origin: '*'
    }
})
export class RoomGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        @Inject(forwardRef(() => RoomService))
        private readonly roomService: RoomService,
        private readonly notificationsService: NotificationsService
    ) {}

    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('RoomGateway');

    afterInit(): void {
        this.logger.log('Initialized!');
    }

    handleDisconnect(client: Socket): void {
        this.logger.log('client disconnected! ' + client.id);
    }

    handleConnection(client: Socket): void {
        this.logger.log('client connected! ' + client.id);
    }

    @SubscribeMessage('sendMsgToRoom')
    async sendMessage(client: Socket, body: MsgToRoom): Promise<void> {
        const room = await this.roomService.getById(body.roomId);
        const msgMaxLength = 10000;
        if (
            true ||
            (await this.server.to(body.roomCode).allSockets()).size < 2
        ) {
            this.notificationsService.send(
                [
                    parseInt(body.userId) === room.animal.owner.id
                        ? room.adoptant.id
                        : room.animal.owner.id
                ],
                {
                    type: ServiceType.ADOPTION,
                    title:
                        parseInt(body.userId) === room.animal.owner.id
                            ? room.animal.owner.firstname
                            : room.adoptant.firstname,
                    body:
                        body.msg.length <= msgMaxLength
                            ? body.msg
                            : body.msg.substring(0, msgMaxLength),
                    icon: ''
                }
            );
        }

        const message = await this.roomService.writeMessage(
            body.roomId,
            body.msg,
            parseInt(body.userId),
            body.type
        );
        this.server.to(body.roomCode).emit('receiveMsgToRoom', message);
    }

    @SubscribeMessage('join')
    async handleJoinRoom(client: Socket, room: string): Promise<void> {
        await client.join(room);
        client.emit('joined', room);
    }

    @SubscribeMessage('message')
    async handleMsg(client: Socket, room: string) {
        client.emit('message', room);
    }

    @SubscribeMessage('leave')
    async handleLeaveRoom(client: Socket, room: string): Promise<void> {
        await client.leave(room);
        client.emit('left', room);
    }
}

export type MsgToRoom = {
    roomCode: string;
    roomId: number;
    userId: string;
    msg: string;
    type: MessageType;
};
