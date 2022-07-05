/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import { ApiProperty } from '@nestjs/swagger';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { User } from '../../users/entities/user.entity';
import { RoomStatus } from '../enums/room-status.enum';
import { Message } from './message.entity';

@Entity('rooms')
export class Room {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column()
    code: string;

    @ApiProperty()
    @Column({ nullable: false, default: RoomStatus.OPENED })
    status: RoomStatus;

    @ApiProperty()
    @Column({ default: false })
    requestGive: boolean;

    @ApiProperty()
    @CreateDateColumn()
    created: Date;

    @ApiProperty({ type: () => Animal })
    @ManyToOne(() => Animal, (animal) => animal.rooms)
    animal: Animal;

    @ApiProperty({ type: () => [Message] })
    @OneToMany(() => Message, (message) => message.room)
    messages: Message[];

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.rooms)
    adoptant: User;

    getCode(): string {
        return `${this.adoptant.id}-room-${this.animal.id}`;
    }

    getLastMessageDate(): Date | null {
        return this.messages.length === 0
            ? null
            : this.messages.at(this.messages.length - 1).created;
    }
}
