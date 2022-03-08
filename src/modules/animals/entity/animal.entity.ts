import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Race } from './race.enum';
import { Sexe } from './sexe.enum';
import { Species } from './species.entity';

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
    sexe: Sexe;

    @Column({ nullable: true })
    birthDate: Date;

    @Column()
    createDate: Date;

    @Column('json')
    images: string[];

    @ManyToOne(() => User, (user) => user.animals)
    owner: User;
}
