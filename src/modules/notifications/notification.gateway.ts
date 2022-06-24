/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Logger } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { Notification } from './entities/notification.entity';

const { NOTIFICATIONS_PORT } = process.env;

@WebSocketGateway(parseInt(NOTIFICATIONS_PORT), {
    cors: {
        origin: '*'
    }
})
export class NotificationsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(@InjectRedis() private readonly redis: Redis) {}

    @WebSocketServer()
    server: Server;

    private logger: Logger = new Logger('NotificationsGateway');

    afterInit(): void {
        this.logger.log('Initialized!');
    }

    async handleDisconnect(client: Socket): Promise<void> {
        await this.redis.del(await this.redis.get(client.id));
        await this.redis.del(client.id);
    }

    async handleConnection(client: Socket): Promise<void> {
        this.logger.log('client connected! ' + client.id);
        client.send('connected', true);
    }

    @SubscribeMessage('setId')
    async sendId(client: Socket, userId: number): Promise<void> {
        await this.redis.set(userId.toString(), client.id);
        await this.redis.set(client.id, userId.toString());
    }

    @SubscribeMessage('clearId')
    async clearId(client: Socket): Promise<void> {
        await this.redis.del(await this.redis.get(client.id));
        await this.redis.del(client.id);
    }

    async sendFrontNotification(
        userId: number,
        notification: Notification
    ): Promise<boolean> {
        const client = await this.redis.get(userId.toString());
        if (!client) {
            return false;
        }
        this.server.to(client).emit('notification', notification);
        return true;
    }
}
