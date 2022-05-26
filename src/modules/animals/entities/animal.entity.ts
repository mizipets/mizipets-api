/**
 * @author Maxime D'HARBOULLE
 * @create 2022-03-23
 */
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Room } from '../../room/entities/room.entity';
import { User } from '../../users/entities/user.entity';
import { Sex } from '../enum/sex.enum';
import { HealthBook } from './health-book';
import { Race } from './race.entity';

@Entity('animals')
export class Animal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    comment: string;

    @ManyToOne(() => Race, (race) => race.animals)
    race: Race;

    @Column({ nullable: true })
    sex: Sex;

    @Column({ nullable: true })
    isAdoption: boolean;

    @Column({ nullable: true })
    isLost: boolean;

    @Column({ nullable: true })
    deletedDate: Date;

    @Column({ nullable: true })
    birthDate: Date;

    @Column()
    createDate: Date;

    @Column('json')
    images: string[];

    @Column('json', { nullable: true })
    healthBook: HealthBook;

    @ManyToOne(() => User, (user) => user.animals)
    owner: User;

    @ManyToOne(() => User, (user) => user.pastAnimals)
    lastOwner: User;

    @OneToMany(() => Room, (room) => room.animal)
    rooms: Room[];
}
