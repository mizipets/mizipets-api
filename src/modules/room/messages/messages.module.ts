/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { Module } from '@nestjs/common';
import { RoomModule } from '../room.module';
import { MessagesGateway } from './messages.gateway';

@Module({
    imports: [RoomModule],
    providers: [MessagesGateway]
})
export class MessagesModule {}
