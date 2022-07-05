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
<<<<<<< HEAD
import { ApiProperty } from '@nestjs/swagger';
=======
>>>>>>> staging

@Entity('devices')
export class Device {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.devices)
    user: User;

    @ApiProperty()
    @Column('text')
    deviceType: string;

    @ApiProperty()
    @Column('text')
    os: string;

    @ApiProperty()
    @Column('text')
    os_version: string;

    @ApiProperty()
    @Column('text')
    browser?: string;

    @ApiProperty()
    @Column('text')
    browser_version?: string;

    @ApiProperty()
    @CreateDateColumn()
    lastConnection: Date;
}
