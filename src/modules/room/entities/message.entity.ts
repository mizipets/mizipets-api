/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    text: string;

    @Column()
    created: Date;

    @Column()
    writer: number;

    @Column()
    type: MessageType;

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
