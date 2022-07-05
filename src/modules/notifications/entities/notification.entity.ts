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
import { ApiProperty } from '@nestjs/swagger';

@Entity('notifications')
export class Notification {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    type: NotificationType;

    @ApiProperty()
    @Column('text')
    title: string;

    @ApiProperty()
    @Column('text')
    body: string;

    @ApiProperty()
    @Column('text')
    icon: string;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.rooms)
    user: User;

    @ApiProperty()
    @CreateDateColumn()
    created: Date;
}
