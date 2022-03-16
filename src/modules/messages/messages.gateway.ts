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
const { MESSAGE_PORT } = process.env;

@WebSocketGateway(parseInt(MESSAGE_PORT), {
    cors: {
        origin: '*'
    }
})
export class MessagesGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor() {
        console.log(parseInt(MESSAGE_PORT));
    }

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

    @SubscribeMessage('msgToServer')
    handleMessage(client: Socket, payload: string): void {
        this.server.emit('msgToClient', 'yooooooooooo');
    }

    @SubscribeMessage('join')
    handleJoinRoom(client: Socket, room: string) {
        client.join(room);
        client.emit('joined', room);
    }

    @SubscribeMessage('leave')
    handleLeaveRoom(client: Socket, room: string) {
        client.leave(room);
        client.emit('left', room);
    }
}
