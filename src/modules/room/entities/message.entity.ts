/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */

import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('messages')
export class Message {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    text: string;

    @ApiProperty()
    @Column()
    created: Date;

    @ApiProperty()
    @Column()
    writer: number;

    @ApiProperty()
    @Column()
    type: MessageType;

    @ApiProperty()
    @Column('int', { array: true, default: [] })
    seen: number[];

    @ApiProperty({ type: () => Room })
    @ManyToOne(() => Room, (room) => room.messages)
    room: Room;
}

export enum MessageType {
    text = 'text',
    init = 'init',
    give = 'give',
    accepted = 'accepted',
    refused = 'refused',
    close = 'close'
}
