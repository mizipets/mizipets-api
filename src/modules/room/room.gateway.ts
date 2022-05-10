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
        private readonly roomService: RoomService
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
        if ((await this.server.to(body.roomCode).allSockets()).size < 2) {
            // TODO: Send notif to other user
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
