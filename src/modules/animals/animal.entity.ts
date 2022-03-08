import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Race } from './enum/race.enum';
import { Sex } from './enum/sex.enum';
import { Species } from './enum/species.enum';
import {User} from "../users/user.entity";

@Entity('animals')
export class Animal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    comment: string;

    @Column()
    species: Species;

    @Column({ nullable: true })
    race: Race;

    @Column({ nullable: true })
    sex: Sex;

    @Column({ nullable: true })
    birthDate: Date;

    @Column()
    createDate: Date;

    @Column('json')
    images: string[];

    @ManyToOne(() => User, (user) => user.animals)
    owner: User;
}
