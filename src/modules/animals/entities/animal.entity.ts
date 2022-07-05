/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Room } from '../../room/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { Sex } from '../enum/sex.enum';
import { Reminder } from '../reminder/entities/reminder.entity';
import { Race } from './race.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('animals')
export class Animal {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    name: string;

    @ApiProperty()
    @Column('text', { nullable: true })
    comment: string;

    @ApiProperty()
    @ManyToOne(() => Race, (race) => race.animals)
    race: Race;

    @ApiProperty()
    @Column({ nullable: true })
    sex: Sex;

    @ApiProperty()
    @Column({ nullable: true })
    isAdoption: boolean;

    @ApiProperty()
    @Column({ nullable: true })
    isLost: boolean;

    @ApiProperty()
    @Column({ nullable: true })
    deletedDate: Date;

    @ApiProperty()
    @Column({ nullable: true })
    birthDate: Date;

    @ApiProperty()
    @Column()
    createDate: Date;

    @ApiProperty()
    @Column('json')
    images: string[];

    @ManyToOne(() => User, (user) => user.animals)
    owner: User;

    @ManyToOne(() => User, (user) => user.pastAnimals)
    lastOwner: User;

    @ApiProperty()
    @OneToMany(() => Room, (room) => room.animal)
    rooms: Room[];

    @ApiProperty()
    @OneToMany(() => Reminder, (reminder) => reminder.animal)
    reminders: Reminder[];

    @ApiProperty()
    @ManyToMany(() => User)
    @JoinTable()
    reports: User[];
}
