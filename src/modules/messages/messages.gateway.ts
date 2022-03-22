import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../room/room.service';

const { MESSAGE_PORT } = process.env;

@WebSocketGateway(parseInt(MESSAGE_PORT), {
    cors: {
        origin: '*'
    }
})
export class MessagesGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private roomService: RoomService) {}

    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('MessagesGateway');

    afterInit(server: Server) {
        this.logger.log('Initialized!');
    }

    handleDisconnect(client: Socket) {
        this.logger.log('client disconnected! ' + client.id);
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log('client connected! ' + client.id);
    }

    @SubscribeMessage('sendMsgToRoom')
    async handleMessage(client: Socket, body: MsgToRoom): Promise<void> {
        if ((await this.server.to(body.roomCode).allSockets()).size < 2) {
            // TODO: Send notif to other user
        }
        this.server.to(body.roomCode).emit('receiveMsgToRoom', body.msg);
        await this.roomService.writeMessage(body.roomId, body.msg, body.userId);
    }

    @SubscribeMessage('join')
    async handleJoinRoom(client: Socket, room: string) {
        await client.join(room);
        client.emit('joined', room);
    }

    @SubscribeMessage('leave')
    async handleLeaveRoom(client: Socket, room: string) {
        await client.leave(room);
        client.emit('left', room);
    }
}

export type MsgToRoom = {
    roomCode: string;
    roomId: number;
    userId: number;
    msg: string;
};
