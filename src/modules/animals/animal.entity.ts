import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Race } from './enum/race.enum';
import { Sex } from './enum/sex.enum';
import { User } from '../users/user.entity';
import { Species } from './enum/species.entity';

@Entity('animals')
export class Animal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    name: string;

    @Column('text', { nullable: true })
    comment: string;

    @ManyToOne(() => Species, (specie) => specie.animals)
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
