/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { InjectRedis, RedisService } from '@liaoliaots/nestjs-redis';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

const { NOTIFICATIONS_PORT } = process.env;

@WebSocketGateway(parseInt(NOTIFICATIONS_PORT), {
    cors: {
        origin: '*'
    }
})
export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(
        private readonly notificationsService: NotificationsService,
        @InjectRedis() private readonly redis: Redis
    ) {}

    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('NotificationsGateway');

    afterInit(): void {
        this.logger.log('Initialized!');
    }

    async handleDisconnect(client: Socket): Promise<void> {
        console.log(await this.redis.get(client.id));
        this.logger.log('client disconnected! ' + client.id);
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log('client connected! ' + client.id);
        await this.redis.set(client.id, 'true');
    }
}
