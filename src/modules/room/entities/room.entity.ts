/**
 * @author Maxime D'HARBOULLE
 * @create 2022-02-25
 */
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { User } from '../../users/entities/user.entity';
import { Message } from './message';

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

    @Column('json')
    messages: Message[];

    @ManyToOne(() => Animal, (animal) => animal.rooms)
    animal: Animal;

    @ManyToOne(() => User, (user) => user.rooms)
    adoptant: User;

    getCode(): string {
        return `${this.adoptant.id}-room-${this.animal.id}`;
    }
}
