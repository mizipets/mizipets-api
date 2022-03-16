import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Animal } from '../animals/entities/animal.entity';
import { User } from '../users/user.entity';
import { Message } from './message';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @CreateDateColumn()
    created: Date;

    @Column('json')
    messages: Message[];

    @ManyToOne(() => Animal, (animal) => animal.rooms)
    animal: Animal;

    @ManyToOne(() => User, (user) => user.rooms)
    adoptant: User;

    getCode() {
        return `${this.adoptant.id}-room-${this.animal.id}`;
    }
}
