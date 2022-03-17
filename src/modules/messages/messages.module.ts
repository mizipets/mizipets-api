import { Module } from '@nestjs/common';
import { RoomModule } from '../room/room.module';
import { MessagesGateway } from './messages.gateway';

@Module({
    imports: [RoomModule],
    providers: [MessagesGateway]
})
export class MessagesModule {}
