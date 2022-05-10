/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
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
import { Message } from './message.entity';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column({ default: false })
    closed: boolean;

    @Column({ default: false })
    requestGive: boolean;

    @CreateDateColumn()
    created: Date;

    @ManyToOne(() => Animal, (animal) => animal.rooms)
    animal: Animal;

    @OneToMany(() => Message, (message) => message.room)
    messages: Message[];

    @ManyToOne(() => User, (user) => user.rooms)
    adoptant: User;

    getCode(): string {
        return `${this.adoptant.id}-room-${this.animal.id}`;
    }
}
