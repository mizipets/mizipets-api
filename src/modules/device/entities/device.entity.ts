/**
 * @author Latif SAGNA
 * @create 2022-03-11
 */
import { User } from '../../users/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { IsString } from 'class-validator';

@Entity('devices')
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.devices)
    user: User;

    @Column('text')
    deviceType: string;

    @Column('text')
    os: string;

    @Column('text')
    os_version: string;

    @Column('text')
    browser?: string;

    @Column('text')
    browser_version?: string;

    @CreateDateColumn()
    lastConnection: Date;
}
