/**
 * @author  Maxime D'HARBOULLE
 * @create 2022-04-26
 */
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotificationType } from './notification-type.enum';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    type: NotificationType;

    @Column('text')
    title: string;

    @Column('text')
    body: string;

    @Column('text')
    icon: string;

    @ManyToOne(() => User, (user) => user.rooms)
    user: User;

    @CreateDateColumn()
    created: Date;
}
